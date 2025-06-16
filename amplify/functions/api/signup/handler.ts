import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Customer, Partner } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

type SignupResponse = {
  id: string;
  email: string;
  type: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    switch (event.requestContext.http.method) {
      case 'POST': {
        if (!event.body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'リクエストボディが必要です' }),
          };
        }

        const { email, password, type, name, phone, companyName, businessPhone, address, description } = JSON.parse(event.body);

        if (!email || !password || !type) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: '必須項目が不足しています' }),
          };
        }

        // メールアドレスの重複チェック
        const existingCustomer = await prisma.customer.findUnique({
          where: { email },
        });

        const existingPartner = await prisma.partner.findUnique({
          where: { email },
        });

        if (existingCustomer || existingPartner) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'このメールアドレスは既に使用されています' }),
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user: Customer | Partner;
        let signupResponse: SignupResponse;

        if (type === 'CUSTOMER') {
          if (!name) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: '名前は必須です' }),
            };
          }

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
          };
        } else if (type === 'PARTNER') {
          if (!companyName) {
            return {
              statusCode: 400,
              body: JSON.stringify({ message: '会社名は必須です' }),
            };
          }

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
          };
        } else {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: '無効なユーザータイプです' }),
          };
        }

        return {
          statusCode: 201,
          body: JSON.stringify({ user: signupResponse }),
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