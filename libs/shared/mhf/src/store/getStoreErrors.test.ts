import { mockContext, mockEntry, mockSessionId } from '../mocks';
import { getSessionId } from '../utils/getSessionId';
import { getStoreEntry } from './getStoreEntry';
import { getStoreErrors } from './getStoreErrors';

jest.mock('../utils/getSessionId');
jest.mock('./getStoreEntry');

describe('getStoreErrors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue(mockEntry);
  });

  it('returns the errors array from the store entry', async () => {
    const result = await getStoreErrors(mockContext);

    expect(result).toEqual(mockEntry.errors);
  });

  it('returns an empty array if no session ID is found', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);
    const result = await getStoreErrors(mockContext);
    expect(result).toEqual({});
  });

  it('throws an error if session data is not found', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue(undefined);

    await expect(getStoreErrors(mockContext)).rejects.toThrow(
      'Session data not found',
    );
  });
});
