import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: 'updateTodo',
        authorizer:{
          name: "PrivateAuthorizer-vibin",
          type: "COGNITO_USER_POOLS",
          arn:"arn:aws:cognito-idp:us-east-1:877969058937:userpool/us-east-1_tS4kPcFzo"
        },
      },
    },
  ],
};
