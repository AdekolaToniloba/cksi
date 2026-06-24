import { expect } from "vitest";

type JsonBody = Record<string, unknown>;

async function expectJsonResponse(
  response: Response,
  expectedStatuses: readonly number[]
) {
  expect(expectedStatuses).toContain(response.status);
  expect(response.headers.get("content-type") ?? "").toContain(
    "application/json"
  );

  return (await response.json()) as JsonBody;
}

function expectFailedBody(body: JsonBody) {
  if ("success" in body) {
    expect(body.success).toBe(false);
  }
}

export async function expectUnauthorized(response: Response) {
  const body = await expectJsonResponse(response, [401]);
  expectFailedBody(body);
  return body;
}

export async function expectForbidden(response: Response) {
  const body = await expectJsonResponse(response, [403]);
  expectFailedBody(body);
  return body;
}

export async function expectValidationFailure(response: Response) {
  const body = await expectJsonResponse(response, [400, 422]);
  expectFailedBody(body);
  return body;
}

export async function expectAdminJsonSuccess<TBody extends JsonBody>(
  response: Response,
  expectedStatuses: readonly number[] = [200, 201]
) {
  const body = await expectJsonResponse(response, expectedStatuses);

  if ("success" in body) {
    expect(body.success).toBe(true);
  }

  return body as TBody;
}
