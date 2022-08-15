import type { AWS } from '@serverless/typescript';

import createTodo from '@functions/createTodo';
import getTodo from '@functions/getTodo';
import updateTodo from '@functions/updateTodo';
import deleteTodo from '@functions/deleteTodo';
import register from '@functions/register';

const serverlessConfiguration: AWS = {
  service: 'node-app-vibin',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      user_pool_id: { Ref: "UserPool" },
      client_id: { Ref: "UserClient" }
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "cognito-idp:AdminInitiateAuth",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserPassword"
        ],
        Resource: [
          "arn:aws:dynamodb:us-east-1:877969058937:table/Todo-Vibin",
          "arn:aws:dynamodb:us-east-1:877969058937:table/Todo-Vibin/index/*",
          "arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_tS4kPcFzo"
        ]
      },
    ],
  },
  // import the function via paths
  functions: { createTodo,getTodo,updateTodo ,deleteTodo,register},
  package: { individually: true },
  
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },

  resources: {
    Resources: {
      TodoTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: "Todo-Vibin",
          BillingMode:"PAY_PER_REQUEST",
          AttributeDefinitions: [{
            AttributeName: "Id",
            AttributeType: "S",
          }],
          KeySchema: [{
            AttributeName: "Id",
            KeyType: "HASH"
          }]
        }
      }
      ,
    UserPool:{
      Type: "AWS::Cognito::UserPool",
      Properties:{
        UserPoolName: "serverless-auth-pool-vibin",
        Schema:[{
          Name: "email",
          Required: true,
          Mutable: true
        }],
        Policies:{
          PasswordPolicy:{
            MinimumLength: 6,
          }
        },
        AutoVerifiedAttributes: ["email"]
      }
    },
    UserClient:{
      Type: "AWS::Cognito::UserPoolClient",
      Properties:{
        ClientName: "user-pool-client-vibin",
        GenerateSecret: false,
        UserPoolId:  { Ref: "UserPool" },
        AccessTokenValidity: 5,
        IdTokenValidity: 5,
        ExplicitAuthFlows:["ADMIN_NO_SRP_AUTH"]
      }
       
    }
      
  }
      }
      }
;

module.exports = serverlessConfiguration;
