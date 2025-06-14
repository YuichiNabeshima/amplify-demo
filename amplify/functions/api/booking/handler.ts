import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { TestService } from "../../../../src/services/TestService";
import * as dotenv from 'dotenv';

dotenv.config();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);

  switch (event.requestContext.http.method) {
    case "GET":
      const result = new TestService();
      return { statusCode: 200, body: JSON.stringify([await result.testExecute()]) }
    case "POST":
      return { statusCode: 201, body: JSON.stringify({ success: true }) };
    default:
      return { statusCode: 405, body: "Method Not Allowed" };
  }
};
