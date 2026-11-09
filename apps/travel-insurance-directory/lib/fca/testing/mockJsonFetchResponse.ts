/** Minimal `Response` stub for unit tests that stub `globalThis.fetch`. */
export function mockJsonFetchResponse(
  body: unknown,
  ok = true,
  status = 200,
): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}
