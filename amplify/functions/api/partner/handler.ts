import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type PartnerResponse = {
  id: string;
  email: string;
  companyName: string;
  businessPhone: string;
  address: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authentication required' }),
      };
    }

    const token = authHeader.split(' ')[1];
    let decoded: { id: string; type: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    if (decoded.type !== 'PARTNER') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Access restricted to partners only' }),
      };
    }

    switch (event.requestContext.http.method) {
      case 'GET': {
        const partner = await prisma.partner.findUnique({
          where: { id: decoded.id },
        });

        if (!partner) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Partner not found' }),
          };
        }

        const partnerResponse: PartnerResponse = {
          id: partner.id,
          email: partner.email,
          companyName: partner.companyName,
          businessPhone: partner.businessPhone,
          address: partner.address,
          description: partner.description,
          createdAt: partner.createdAt,
          updatedAt: partner.updatedAt,
        };

        return {
          statusCode: 200,
          body: JSON.stringify({ partner: partnerResponse }),
        };
      }
      case 'PUT': {
        if (!event.body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is required' }),
          };
        }

        const { companyName, businessPhone, address, description, currentPassword, newPassword } = JSON.parse(event.body);
        const partner = await prisma.partner.findUnique({
          where: { id: decoded.id },
        });

        if (!partner) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Partner not found' }),
          };
        }

        if (currentPassword && newPassword) {
          const isValidPassword = await bcrypt.compare(currentPassword, partner.password);
          if (!isValidPassword) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'Current password is incorrect' }),
            };
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const updatedPartner = await prisma.partner.update({
            where: { id: decoded.id },
            data: {
              companyName,
              businessPhone,
              address,
              description,
              password: hashedPassword,
            },
          });

          const partnerResponse: PartnerResponse = {
            id: updatedPartner.id,
            email: updatedPartner.email,
            companyName: updatedPartner.companyName,
            businessPhone: updatedPartner.businessPhone,
            address: updatedPartner.address,
            description: updatedPartner.description,
            createdAt: updatedPartner.createdAt,
            updatedAt: updatedPartner.updatedAt,
          };

          return {
            statusCode: 200,
            body: JSON.stringify({ partner: partnerResponse }),
          };
        } else {
          const updatedPartner = await prisma.partner.update({
            where: { id: decoded.id },
            data: {
              companyName,
              businessPhone,
              address,
              description,
            },
          });

          const partnerResponse: PartnerResponse = {
            id: updatedPartner.id,
            email: updatedPartner.email,
            companyName: updatedPartner.companyName,
            businessPhone: updatedPartner.businessPhone,
            address: updatedPartner.address,
            description: updatedPartner.description,
            createdAt: updatedPartner.createdAt,
            updatedAt: updatedPartner.updatedAt,
          };

          return {
            statusCode: 200,
            body: JSON.stringify({ partner: partnerResponse }),
          };
        }
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