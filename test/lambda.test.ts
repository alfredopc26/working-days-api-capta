import { handler } from "../lambda/index";
import { APIGatewayProxyEvent } from "aws-lambda";

function buildEvent(query: Record<string, any>): APIGatewayProxyEvent {
  return {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "/",
    pathParameters: null,
    queryStringParameters: query as any,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: "/"
  };
}

describe("Lambda Business Days API", () => {
  it("1. Debería devolver lunes a las 9:00 a.m. (hora Colombia)", async () => {
    const event = buildEvent({ hours: 1, date: "2025-09-19T22:00:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    // 9:00 a.m. COL = 14:00 UTC
    expect(body.date).toMatch(/T14:00:00/);
  });

  it("2. Debería devolver lunes a las 9:00 a.m. (hora Colombia)", async () => {
    const event = buildEvent({ hours: 1, date: "2025-09-20T19:00:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T14:00:00/);
  });

  it("3. Debería devolver jueves a las 10:00 a.m. (hora Colombia)", async () => {
    const event = buildEvent({ hours: 4, days: 1, date: "2025-09-16T20:00:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T15:00:00/);
  });

  it("4. Debería devolver lunes a las 5:00 p.m. (hora Colombia)", async () => {
    const event = buildEvent({ days: 1, date: "2025-09-21T23:00:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T22:00:00/);
  });

  it("5. Debería devolver mismo día a las 5:00 p.m. (hora Colombia)", async () => {
    const event = buildEvent({ hours: 8, date: "2025-09-22T13:00:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T22:00:00/);
  });

  it("6. Debería devolver siguiente día laboral a las 8:00 a.m. (hora Colombia)", async () => {
    const event = buildEvent({ days: 1, date: "2025-09-22T13:00:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T13:00:00/);
  });

  it("7. Debería devolver siguiente día laboral a las 12:00 p.m. (hora Colombia)", async () => {
    const event = buildEvent({ days: 1, date: "2025-09-22T17:30:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T17:00:00/);
  });

  it("8. Debería devolver mismo día laboral a las 3:30 p.m. (hora Colombia)", async () => {
    const event = buildEvent({ hours: 3, date: "2025-09-22T16:30:00Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toMatch(/T20:30:00/);
  });

  it("9. Debería devolver 21 de abril a las 3:30 p.m. (hora Colombia)", async () => {
    const event = buildEvent({ days: 5, hours: 4, date: "2025-04-10T15:00:00.000Z" });
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(body.date).toBe("2025-04-21T20:00:00.000Z");
  });
});
