import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Customer, Partner } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type SignupResponse = {
  id: string;
  email: string;
  type: string;
  name?: string | null;
  companyName?: string;
  businessPhone?: string;
  address?: string;
  token: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    switch (event.requestContext.http.method) {
      case 'POST': {
        if (!event.body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is required' }),
          };
        }

        const { email, password, type, name, phone, companyName, businessPhone, address, description } = JSON.parse(event.body);

        if (!email || !password || !type) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields' }),
          };
        }

        // Check for duplicate email
        const existingCustomer = await prisma.customer.findUnique({
          where: { email },
        });

        const existingPartner = await prisma.partner.findUnique({
          where: { email },
        });

        if (existingCustomer || existingPartner) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email already exists' }),
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user: Customer | Partner;
        let signupResponse: SignupResponse;

        if (type === 'CUSTOMER') {
          user = await prisma.customer.create({
            data: {
              email,
              password: hashedPassword,
              name,
              phone,
            },
          });
          signupResponse = {
            id: user.id,
            email: user.email,
            type: 'CUSTOMER',
            name: user.name as string | null,
            token: jwt.sign({ id: user.id, type: 'CUSTOMER' }, JWT_SECRET),
          };
        } else if (type === 'PARTNER') {
          user = await prisma.partner.create({
            data: {
              email,
              password: hashedPassword,
              companyName,
              businessPhone,
              address,
              description,
            },
          });
          signupResponse = {
            id: user.id,
            email: user.email,
            type: 'PARTNER',
            companyName: user.companyName,
            businessPhone: user.businessPhone,
            address: user.address,
            token: jwt.sign({ id: user.id, type: 'PARTNER' }, JWT_SECRET),
          };
        } else {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid user type' }),
          };
        }

        return {
          statusCode: 201,
          body: JSON.stringify(signupResponse),
        };
      }
      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}; 