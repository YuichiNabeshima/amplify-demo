import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Customer, Partner } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  type: string;
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

    switch (event.requestContext.http.method) {
      case 'GET': {
        let user: Customer | Partner | null = null;
        let userResponse: UserResponse | null = null;
        if (decoded.type === 'CUSTOMER') {
          user = await prisma.customer.findUnique({ where: { id: decoded.id } });
          if (user) {
            userResponse = {
              id: user.id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              type: decoded.type,
            };
          }
        } else if (decoded.type === 'PARTNER') {
          user = await prisma.partner.findUnique({ where: { id: decoded.id } });
          if (user) {
            userResponse = {
              id: user.id,
              email: user.email,
              name: user.companyName,
              phone: user.businessPhone,
              type: decoded.type,
            };
          }
        }
        if (!user || !userResponse) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'ユーザーが見つかりません' }),
          };
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ user: userResponse }),
        };
      }
      case 'PUT': {
        if (!event.body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'リクエストボディが必要です' }),
          };
        }
        const { name, phone, currentPassword, newPassword } = JSON.parse(event.body);
        let user: Customer | Partner | null = null;
        let userResponse: UserResponse | null = null;
        if (decoded.type === 'CUSTOMER') {
          user = await prisma.customer.findUnique({ where: { id: decoded.id } });
          if (!user) {
            return {
              statusCode: 404,
              body: JSON.stringify({ message: 'ユーザーが見つかりません' }),
            };
          }
          if (currentPassword && newPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
              return {
                statusCode: 400,
                body: JSON.stringify({ message: '現在のパスワードが正しくありません' }),
              };
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user = await prisma.customer.update({
              where: { id: decoded.id },
              data: { name, phone, password: hashedPassword },
            });
          } else {
            user = await prisma.customer.update({
              where: { id: decoded.id },
              data: { name, phone },
            });
          }
          userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            type: decoded.type,
          };
        } else if (decoded.type === 'PARTNER') {
          user = await prisma.partner.findUnique({ where: { id: decoded.id } });
          if (!user) {
            return {
              statusCode: 404,
              body: JSON.stringify({ message: 'ユーザーが見つかりません' }),
            };
          }
          if (currentPassword && newPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
              return {
                statusCode: 400,
                body: JSON.stringify({ message: '現在のパスワードが正しくありません' }),
              };
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user = await prisma.partner.update({
              where: { id: decoded.id },
              data: { businessPhone: phone, password: hashedPassword },
            });
          } else {
            user = await prisma.partner.update({
              where: { id: decoded.id },
              data: { businessPhone: phone },
            });
          }
          userResponse = {
            id: user.id,
            email: user.email,
            name: user.companyName,
            phone: user.businessPhone,
            type: decoded.type,
          };
        }
        return {
          statusCode: 200,
          body: JSON.stringify({ user: userResponse }),
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