import { cosmosGetSession } from '@maps-react/cosmos/rest-client';

import { cosmosConnection } from './cosmosConnection';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

jest.mock('utils/sessionToken', () => ({
  encryptSessionId: (id: string) => `enc-${id}`,
  decryptSessionId: (id: string) => id.replace('enc-', ''),
}));

jest.mock('@maps-react/cosmos/rest-client', () => ({
  cosmosGetSession: jest.fn(),
}));

const mockedGetSession = cosmosGetSession as jest.Mock;
const rawSessionId = '123e4567e89b12d3a456426614174000';

describe('cosmosConnection', () => {
  beforeEach(() => {
    mockedGetSession.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns true when Cosmos responds with not found', async () => {
    mockedGetSession.mockResolvedValue({ status: 404 });

    await expect(cosmosConnection()).resolves.toBe(true);
    expect(mockedGetSession).toHaveBeenCalledWith(rawSessionId);
  });

  it('returns false when Cosmos responds with another status', async () => {
    mockedGetSession.mockResolvedValue({ status: 500, error: 'down' });

    await expect(cosmosConnection()).resolves.toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      '[Cosmos] connection check failed',
      500,
      'down',
    );
  });

  it('returns false when the check throws', async () => {
    const error = new Error('network');
    mockedGetSession.mockRejectedValue(error);

    await expect(cosmosConnection()).resolves.toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      '[Cosmos] connection check failed',
      error,
    );
  });
});
