import type { AWS } from '@serverless/typescript';

import createTodo from '@functions/createTodo';
import getTodo from '@functions/getTodo';
import updateTodo from '@functions/updateTodo';
import deleteTodo from '@functions/deleteTodo';

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
        ],
        Resource: ["arn:aws:dynamodb:us-east-1:877969058937:table/Todo-Vibin","arn:aws:dynamodb:us-east-1:877969058937:table/Todo-Vibin/index/*"]
      },
    ],
  },
  // import the function via paths
  functions: { createTodo,getTodo,updateTodo ,deleteTodo},
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
        }}}}
};

module.exports = serverlessConfiguration;
