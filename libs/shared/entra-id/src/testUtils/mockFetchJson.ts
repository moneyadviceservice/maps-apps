export function mockFetchJson(fetchMock: jest.Mock, payload: unknown): void {
  fetchMock.mockResolvedValueOnce({
    json: async () => payload,
  });
}

export function mockFetchJsonSequence(
  fetchMock: jest.Mock,
  payloads: unknown[],
): void {
  payloads.forEach((p) => mockFetchJson(fetchMock, p));
}
