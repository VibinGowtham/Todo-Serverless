import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import dynamoDB from "../../model/dbConfig";

const getTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

const {date}=event.pathParameters;
  var params = {
    TableName: 'Todo-Vibin',
    IndexName: 'date-index',
    KeyConditionExpression: '#name = :value',
    ExpressionAttributeValues: { ':value': date },
    ExpressionAttributeNames: { '#name': 'date' }
  }
  
  console.log(date);
  console.log(params);
  

  try{
    console.log("in");
    
    const results=await dynamoDB.query(params).promise();
    console.log(results);
    
    return formatJSONResponse({
      Todos: results.Items
    });
  }
  catch(error){
    return formatJSONResponse({
      message: "Cannot process request",
      error
    });
  }
 

  
};

export const main = middyfy(getTodo);
