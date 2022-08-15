import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import dynamoDB from "../../model/dbConfig";
const updateTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const{ Id,todo }=event.body;
  
try {
  const results=await dynamoDB.update({
    TableName:"Todo-Vibin",
    Key:{Id},
    UpdateExpression:`set todo=:todo`,
    ExpressionAttributeValues:{
          ':todo':todo
    },
    ReturnValues:"ALL_NEW"
  }).promise();

  return formatJSONResponse({
    message: results
  });
  
} catch (error) {
  return formatJSONResponse({
    message: `Error Creating Todo`
  });
}
   
};

export const main = middyfy(updateTodo);
