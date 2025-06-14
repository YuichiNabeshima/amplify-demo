import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { parseAmplifyConfig } from 'aws-amplify/utils';
import outputs from '@/amplify_outputs.json';
import { Schema } from '@/amplify/data/resource';

const amplifyConfig = parseAmplifyConfig(outputs);
const restApis = Object.fromEntries(
  Object.entries(outputs.custom.API).map(([name, api]) => [
    name,
    { endpoint: api.endpoint, region: api.region },
  ])
);

Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: restApis,
  },
});

export const client = generateClient<Schema>();
