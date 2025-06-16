import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type MeResponse = {
  id: string;
  email: string;
  type: string;
  name?: string;
  companyName?: string;
  businessPhone?: string;
  address?: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: '認証が必要です' }),
      };
    }
    const token = authHeader.split(' ')[1];
    let decoded: { id: string; type: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: '無効なトークンです' }),
      };
    }

    let user: any = null;
    if (decoded.type === 'CUSTOMER') {
      user = await prisma.customer.findUnique({ where: { id: decoded.id } });
    } else if (decoded.type === 'PARTNER') {
      user = await prisma.partner.findUnique({ where: { id: decoded.id } });
    }

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'ユーザーが見つかりません' }),
      };
    }

    const meResponse: MeResponse = {
      id: user.id,
      email: user.email,
      type: decoded.type,
      ...(decoded.type === 'CUSTOMER'
        ? {
            name: user.name ?? undefined,
            address: user.address ?? undefined,
          }
        : {
            companyName: user.companyName,
            businessPhone: user.businessPhone,
            address: user.address ?? undefined,
          }),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ user: meResponse }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
}; 