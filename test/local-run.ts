import { handler } from "../lambda/index";
import { APIGatewayProxyEvent } from "aws-lambda";

// Simula un evento de API Gateway
const mockEvent1: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    hours: 1,
    date: "2025-09-19T22:00:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent2: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    hours: 1,
    date: "2025-09-20T19:00:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent3: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    hours: 4,
    days: 1,
    date: "2025-09-23T20:00:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent4: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    days: 1,
    date: "2025-09-21T23:00:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent5: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    hours: 8,
    date: "2025-09-22T13:00:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent6: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    days: 1,
    date: "2025-09-22T13:00:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent7: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    days: 1,
    date: "2025-09-22T17:30:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent8: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    hours: 3,
    date: "2025-09-22T16:30:00Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

const mockEvent9: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {  
    days: 5,
    hours: 4,
    date: "2025-04-10T15:00:00.000Z" // opcional
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: "/"
};

async function run() {
//   const pet1 = await handler(mockEvent1);
//   const pet2 = await handler(mockEvent2);
  // const pet3 = await handler(mockEvent3);
  // const pet4 = await handler(mockEvent4);
  // const pet5 = await handler(mockEvent5);
  // const pet6 = await handler(mockEvent6);
  const pet7 = await handler(mockEvent7);
  // const pet8 = await handler(mockEvent8);
  // const pet9 = await handler(mockEvent9);
  // console.log("1. Resultado esperado: lunes a las 9:00 a.m. (hora Colombia) → '2025-XX-XXT14:00:00Z' (UTC)", pet1);
  // console.log("2. Resultado esperado: lunes a las 9:00 a.m. (hora Colombia) → '2025-XX-XXT14:00:00Z' (UTC)", pet2);
  // console.log("3. Resultado esperado: jueves a las 10:00 a.m. (hora Colombia) → '2025-XX-XXT15:00:00Z' (UTC)", pet3);
  // console.log("4. Resultado esperado: lunes a las 5:00 p.m. (hora Colombia) → '2025-XX-XXT22:00:00Z' (UTC)", pet4);
  // console.log("5. Resultado esperado: mismo día a las 5:00 p.m. (hora Colombia) → '2025-XX-XXT22:00:00Z' (UTC)", pet5);
  // console.log("6. Resultado esperado: siguiente día laboral a las 8:00 a.m. (hora Colombia) → '2025-XX-XXT13:00:00Z' (UTC)", pet6);
  console.log("7. Resultado esperado: siguiente día laboral a las 12:00 p.m. (hora Colombia) → '2025-XX-XXT17:00:00Z' (UTC)", pet7);
  // console.log("8. Resultado esperado: mismo día laboral a las 3:30 p.m. (hora Colombia) → 2025-XX-XXT20:30:00Z (UTC)", pet8);
  // console.log("9. Resultado esperado: 21 de abril a las 3:30 p.m. (hora Colombia) → '2025-04-21T20:00:00.000Z' (UTC)", pet9);
}

run();
