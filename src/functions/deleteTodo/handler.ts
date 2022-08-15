import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import dynamoDB from "../../model/dbConfig";
const deleteTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const{ Id }=event.pathParameters;
  
try {
  await dynamoDB.delete({
    TableName:"Todo-Vibin",
    Key:{Id}
  }).promise();
  
} catch (error) {
  return formatJSONResponse({
    message: `Error Deleting Todo`
  });
}

return formatJSONResponse({
  message: "Todo Deleted Successfully"
});
   
};

export const main = middyfy(deleteTodo);
