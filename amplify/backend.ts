import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import {
  HttpIamAuthorizer,
  HttpUserPoolAuthorizer,
} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { bookingApi } from "./functions/api/booking/resource";
import { partnerApi } from "./functions/api/partner/resource";
import { partnersApi } from "./functions/api/partners/resource";
import { signupApi } from "./functions/api/signup/resource";
import { signinApi } from "./functions/api/signin/resource";
import { signoutApi } from "./functions/api/signout/resource";
import { verifyApi } from "./functions/api/verify/resource";
import { meApi } from "./functions/api/me/resource";

import { auth } from "./auth/resource";
import { data } from "./data/resource";

export const backend = defineBackend({
  auth,
  data,
  bookingApi,
  partnerApi,
  partnersApi,
  signupApi,
  signinApi,
  signoutApi,
  verifyApi,
  meApi,
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

// create a IAM authorizer
const iamAuthorizer = new HttpIamAuthorizer();

// create a User Pool authorizer
const userPoolAuthorizer = new HttpUserPoolAuthorizer(
  "userPoolAuth",
  backend.auth.resources.userPool,
  {
    userPoolClients: [backend.auth.resources.userPoolClient],
  }
);

// create a new HTTP Lambda integration
const bookingIntegration = new HttpLambdaIntegration(
  "BookingIntegration",
  backend.bookingApi.resources.lambda
);

const partnerIntegration = new HttpLambdaIntegration(
  "PartnerIntegration",
  backend.partnerApi.resources.lambda
);

const partnersIntegration = new HttpLambdaIntegration(
  "PartnersIntegration",
  backend.partnersApi.resources.lambda
);

const signupIntegration = new HttpLambdaIntegration(
  "SignupIntegration",
  backend.signupApi.resources.lambda
);

const signinIntegration = new HttpLambdaIntegration(
  "SigninIntegration",
  backend.signinApi.resources.lambda
);

const signoutIntegration = new HttpLambdaIntegration(
  "SignoutIntegration",
  backend.signoutApi.resources.lambda
);

const verifyIntegration = new HttpLambdaIntegration(
  "VerifyIntegration",
  backend.verifyApi.resources.lambda
);

const meIntegration = new HttpLambdaIntegration(
  "MeIntegration",
  backend.meApi.resources.lambda
);

// create a new HTTP API with IAM as default authorizer
export const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "myHttpApi",
  corsPreflight: {
    // Modify the CORS settings below to match your specific requirements
    allowMethods: [
      CorsHttpMethod.GET,
      CorsHttpMethod.POST,
      CorsHttpMethod.PUT,
      CorsHttpMethod.DELETE,
    ],
    // Restrict this to domains you trust
    allowOrigins: ["*"],
    // Specify only the headers you need to allow
    allowHeaders: ["*"],
  },
  createDefaultStage: true,
});

httpApi.addRoutes({
  path: "/booking",
  methods: [HttpMethod.GET, HttpMethod.POST],
  integration: bookingIntegration,
});

httpApi.addRoutes({
  path: "/partner",
  methods: [HttpMethod.GET, HttpMethod.PUT],
  integration: partnerIntegration,
});

httpApi.addRoutes({
  path: "/partners",
  methods: [HttpMethod.GET],
  integration: partnersIntegration,
});

httpApi.addRoutes({
  path: "/signup",
  methods: [HttpMethod.POST],
  integration: signupIntegration,
});

httpApi.addRoutes({
  path: "/signin",
  methods: [HttpMethod.POST],
  integration: signinIntegration,
});

httpApi.addRoutes({
  path: "/signout",
  methods: [HttpMethod.POST],
  integration: signoutIntegration,
});

httpApi.addRoutes({
  path: "/verify",
  methods: [HttpMethod.POST],
  integration: verifyIntegration,
});

httpApi.addRoutes({
  path: "/me",
  methods: [HttpMethod.GET],
  integration: meIntegration,
});

// create a new IAM policy to allow Invoke access to the API
const apiPolicy = new Policy(apiStack, "ApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${httpApi.arnForExecuteApi("*", "/items")}`,
        `${httpApi.arnForExecuteApi("*", "/items/*")}`,
        `${httpApi.arnForExecuteApi("*", "/cognito-auth-path")}`,
      ],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});