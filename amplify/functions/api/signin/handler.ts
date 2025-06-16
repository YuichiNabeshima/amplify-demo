import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PrismaClient, Customer, Partner } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type SigninResponse = {
  id: string;
  email: string;
  type: string;
  token: string;
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

        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'メールアドレスとパスワードが必要です' }),
          };
        }

        // 顧客として検索
        let user: Customer | Partner | null = await prisma.customer.findUnique({
          where: { email },
        });

        let userType = 'CUSTOMER';

        // 顧客が見つからない場合はパートナーとして検索
        if (!user) {
          user = await prisma.partner.findUnique({
            where: { email },
          });
          userType = 'PARTNER';
        }

        if (!user) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'メールアドレスまたはパスワードが正しくありません' }),
          };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: 'メールアドレスまたはパスワードが正しくありません' }),
          };
        }

        const token = jwt.sign(
          { id: user.id, type: userType },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        const signinResponse: SigninResponse = {
          id: user.id,
          email: user.email,
          type: userType,
          token,
        };

        return {
          statusCode: 200,
          body: JSON.stringify({ user: signinResponse }),
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