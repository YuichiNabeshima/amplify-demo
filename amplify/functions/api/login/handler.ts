import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Customer, Partner } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type LoginResponse = {
  id: string;
  email: string;
  type: string;
  name?: string;
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

        const { email, password, type } = JSON.parse(event.body);

        if (!email || !password || !type) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields' }),
          };
        }

        let user: Customer | Partner | null = null;
        let loginResponse: LoginResponse;

        if (type === 'CUSTOMER') {
          user = await prisma.customer.findUnique({
            where: { email },
          });
        } else if (type === 'PARTNER') {
          user = await prisma.partner.findUnique({
            where: { email },
          });
        } else {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid user type' }),
          };
        }

        if (!user) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid email or password' }),
          };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid email or password' }),
          };
        }

        if (type === 'CUSTOMER') {
          loginResponse = {
            id: user.id,
            email: user.email,
            type: 'CUSTOMER',
            name: user.name,
            token: jwt.sign({ id: user.id, type: 'CUSTOMER' }, JWT_SECRET),
          };
        } else {
          loginResponse = {
            id: user.id,
            email: user.email,
            type: 'PARTNER',
            companyName: user.companyName,
            businessPhone: user.businessPhone,
            address: user.address,
            token: jwt.sign({ id: user.id, type: 'PARTNER' }, JWT_SECRET),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify(loginResponse),
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