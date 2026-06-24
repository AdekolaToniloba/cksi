import { NextRequest } from "next/server";

type QueryPrimitive = string | number | boolean;
type QueryValue =
  | QueryPrimitive
  | QueryPrimitive[]
  | null
  | undefined;

type QueryParams = Record<string, QueryValue>;

type RouteRequestOptions = {
  method?: string;
  query?: QueryParams;
  json?: unknown;
  headers?: HeadersInit;
};

export function createRouteRequest(
  path: string,
  options: RouteRequestOptions = {}
) {
  const url = new URL(path, "http://localhost");

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }

      continue;
    }

    url.searchParams.set(key, String(value));
  }

  const headers = new Headers(options.headers);
  let body: string | undefined;

  if (options.json !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(options.json);
  }

  return new NextRequest(url, {
    method: options.method ?? (body ? "POST" : "GET"),
    headers,
    body,
  });
}

export function createRouteContext<TParams extends Record<string, string>>(
  params: TParams
) {
  return { params: Promise.resolve(params) };
}
