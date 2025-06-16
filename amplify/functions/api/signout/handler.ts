import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as dotenv from 'dotenv';

dotenv.config();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    switch (event.requestContext.http.method) {
      case 'POST': {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'ログアウトしました' }),
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