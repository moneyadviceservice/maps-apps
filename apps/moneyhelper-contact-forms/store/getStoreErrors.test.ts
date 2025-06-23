import { GetServerSidePropsContext } from 'next';

import { Entry } from '../lib/types';
import { getSessionId } from '../lib/utils/getSessionId';
import { getStoreEntry } from './getStoreEntry';
import { getStoreErrors } from './getStoreErrors';

jest.mock('../lib/utils/getSessionId');
jest.mock('./getStoreEntry');

describe('getStoreErrors', () => {
  const mockContext = {} as GetServerSidePropsContext;
  const mockSessionId = 'test-session-id';
  const mockEntry = {
    errors: [
      { field: 'field-1', message: 'Field 1 is required' },
      { field: 'field-2', message: 'Field 2 is required' },
    ],
  } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();

    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({ entry: mockEntry });
  });

  it('returns the errors array from the store entry', async () => {
    const result = await getStoreErrors(mockContext);

    expect(result).toEqual(mockEntry.errors);
  });

  it('returns an empty array if no session ID is found', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);
    const result = await getStoreErrors(mockContext);
    expect(result).toEqual([]);
  });

  it('throws an error if session data is not found', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({ entry: undefined });

    await expect(getStoreErrors(mockContext)).rejects.toThrow(
      'Session data not found',
    );
  });
});
