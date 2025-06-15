import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from './prisma';
import { signUp, signIn, signOut, getCurrentUser as getAmplifyUser } from 'aws-amplify/auth';
import { Customer, Partner } from '@prisma/client';

export class AuthService {
  // Customer signup
  static async signUpCustomer(email: string, password: string, name?: string) {
    const hashedPassword = await hash(password, 12);
    
    const customer = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return { customer, token };
  }

  // Partner signup
  static async signUpPartner(
    email: string, 
    password: string, 
    companyName: string,
    businessPhone: string,
    address: string
  ) {
    const hashedPassword = await hash(password, 12);
    
    const partner = await prisma.partner.create({
      data: {
        email,
        password: hashedPassword,
        companyName,
        businessPhone,
        address,
        images: ''
      }
    });

    const token = sign(
      { id: partner.id, email: partner.email, type: 'partner' },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return { partner, token };
  }

  // Sign in (for both customer and partner)
  static async signIn(email: string, password: string) {
    // Try to find customer
    let user = await prisma.customer.findUnique({ where: { email } });
    let userType = 'customer';

    // If not found, try to find partner
    if (!user) {
      const partner = await prisma.partner.findUnique({ where: { email } });
      if (partner) {
        user = {
          id: partner.id,
          email: partner.email,
          password: partner.password,
          name: null,
          phone: null,
          address: partner.address,
          createdAt: partner.createdAt,
          updatedAt: partner.updatedAt
        };
        userType = 'partner';
      }
    }

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = sign(
      { id: user.id, email: user.email, type: userType },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return { user, token };
  }

  // Verify token
  static async verifyToken(token: string) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

// Handle user sign up process
export async function handleSignUp(email: string, password: string, type: 'customer' | 'partner', name?: string) {
  try {
    // Sign up with Amplify authentication
    const { isSignUpComplete, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });

    if (isSignUpComplete) {
      // Create user record in PostgreSQL
      const user = type === 'customer' 
        ? await prisma.customer.create({
            data: { email, name, password }
          })
        : await prisma.partner.create({
            data: { email, password, companyName: name || '', businessPhone: '', address: '', images: '' }
          });

      // Sign in the user after successful sign up
      const { isSignedIn } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        return { success: true, user };
      }
    }

    return { success: false, error: 'Sign up process not completed' };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error };
  }
}

// Handle user sign in process
export async function handleSignIn(email: string, password: string) {
  try {
    // Sign in with Amplify authentication
    const { isSignedIn } = await signIn({
      username: email,
      password,
    });

    if (isSignedIn) {
      // Fetch user data from PostgreSQL
      const customer = await prisma.customer.findUnique({ where: { email } });
      const partner = await prisma.partner.findUnique({ where: { email } });
      const user = customer || partner;

      return { success: true, user };
    }

    return { success: false };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error };
  }
}

// Handle user sign out process
export async function handleSignOut() {
  try {
    await signOut();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
}

// Get current user data
export async function getCurrentUser(): Promise<(Customer | Partner) | null> {
  try {
    // Get current authenticated user from Amplify
    const { username } = await getAmplifyUser();
    
    // Fetch user data from PostgreSQL
    const customer = await prisma.customer.findUnique({ where: { email: username } });
    const partner = await prisma.partner.findUnique({ where: { email: username } });
    
    return customer || partner;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
} 