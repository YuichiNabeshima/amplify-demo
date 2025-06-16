import { defineFunction } from "@aws-amplify/backend";
import * as dotenv from 'dotenv';

dotenv.config();

export const meApi = defineFunction({
  name: "me-api",
  environment: {
    DATABASE_URL: process.env.DATABASE_URL as string,
    PRISMA_QUERY_ENGINE_LIBRARY:
      '/opt/nodejs/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
  },
  layers: {
    'prisma': 'arn:aws:lambda:ap-northeast-1:160885271249:layer:prisma-layer:2',
  }
}); 