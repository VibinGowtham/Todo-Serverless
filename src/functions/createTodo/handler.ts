import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from "node_modules/uuid";
const AWS= require("aws-sdk");

import schema from './schema';

const createTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const{ todo, date}=event.body;
  const todoTask={
      Id:v4(),todo,date
  }; 
  const dynamoDB=new AWS.DynamoDB.DocumentClient();
try {
  await dynamoDB.put({
    TableName:"Todo-Vibin",
    Item:todoTask
  }).promise();
} catch (error) {
  return formatJSONResponse({
    message: `Error Creating Todo ${error}`
  });
}
   
  
  return formatJSONResponse({
    message: `Todo Added`
  });
};

export const main = middyfy(createTodo);
