import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Partner } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

type PartnerResponse = {
  id: string;
  email: string;
  companyName: string;
  businessPhone: string | null;
  address: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    switch (event.requestContext.http.method) {
      case 'GET': {
        const partners = await prisma.partner.findMany({
          orderBy: { createdAt: 'desc' },
        });

        const partnersResponse: PartnerResponse[] = partners.map(partner => ({
          id: partner.id,
          email: partner.email,
          companyName: partner.companyName,
          businessPhone: partner.businessPhone,
          address: partner.address,
          description: partner.description,
          createdAt: partner.createdAt,
          updatedAt: partner.updatedAt,
        }));

        return {
          statusCode: 200,
          body: JSON.stringify({ partners: partnersResponse }),
        };
      }
      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
}; 