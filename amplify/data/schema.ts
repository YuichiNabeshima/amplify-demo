import { type ClientSchema, a } from '@aws-amplify/backend';

const schema = a.schema({
  // No custom models needed as we'll use PostgreSQL for all data
  // Minimal User model for authentication
  User: a.model({
    email: a.string(),
    userType: a.enum(['customer', 'partner']),
  }),
});

export type Schema = ClientSchema<typeof schema>; 