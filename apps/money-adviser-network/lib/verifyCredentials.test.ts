import { refreshAccessToken, verifyCredentials } from './verifyCredentials';

global.fetch = jest.fn();

const credentials = {
  username: 'username',
  password: 'password',
};

describe('verifyCredentials', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  it('should return an error object if signInInitiate fails', async () => {
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ error: 'Internal Server Error' }),
    } as unknown as Response);

    const res = await verifyCredentials(credentials);

    expect(res).toEqual({ error: 'Internal Server Error' });
  });

  it('should return access_token if signInInitiate returns continuation_token', async () => {
    const expectedContinuationToken = {
      continuation_token: 'continuation_token',
    };
    const expected = { access_token: 'token', refresh_token: 'token' };

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(expectedContinuationToken),
    } as unknown as Response);

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(expectedContinuationToken),
    } as unknown as Response);

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(expected),
    } as unknown as Response);

    const res = await verifyCredentials(credentials);

    expect(res).toEqual(expected);
  });

  it('should return access_token if refreshAccessToken succesfull', async () => {
    const expected = { access_token: 'token', refresh_token: 'token' };

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(expected),
    } as unknown as Response);

    const res = await refreshAccessToken('refresh_token');

    expect(res).toEqual(expected);
  });
});
