import { Amplify } from 'aws-amplify';
import { get, post } from 'aws-amplify/api';

Amplify.configure({
  API: {
    REST: {
      myHttpApi: {
        endpoint: 'https://in25pd8m8l.execute-api.ap-northeast-1.amazonaws.com/',
        region: 'ap-northeast-1'
      }
    }
  }
});

export { get, post }; 