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
  name?: string | null;
  companyName?: string | null;
  businessPhone?: string | null;
  address?: string | null;
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
          const customer = await prisma.customer.findUnique({
            where: { email },
          });
          user = customer;
        } else if (type === 'PARTNER') {
          const partner = await prisma.partner.findUnique({
            where: { email },
          });
          user = partner;
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
          const customer = user as Customer;
          loginResponse = {
            id: customer.id,
            email: customer.email,
            type: 'CUSTOMER',
            name: customer.name,
            token: jwt.sign({ id: customer.id, type: 'CUSTOMER' }, JWT_SECRET),
          };
        } else {
          const partner = user as Partner;
          loginResponse = {
            id: partner.id,
            email: partner.email,
            type: 'PARTNER',
            companyName: partner.companyName,
            businessPhone: partner.businessPhone,
            address: partner.address,
            token: jwt.sign({ id: partner.id, type: 'PARTNER' }, JWT_SECRET),
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