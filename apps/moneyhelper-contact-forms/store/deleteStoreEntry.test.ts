import { GetServerSidePropsContext } from 'next';

import { redisDel } from '@maps-react/redis/helpers';

import { getSessionId } from '../lib/utils';
import { deleteStoreEntry } from './deleteStoreEntry';

jest.mock('@maps-react/redis/helpers', () => ({
  redisDel: jest.fn(),
}));
jest.mock('../lib/utils', () => ({
  getSessionId: jest.fn(),
}));

describe('deleteStoreEntry', () => {
  const mockContext = {} as GetServerSidePropsContext;
  const mockKey = 'mock-key';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call redisDel with the session key', async () => {
    (getSessionId as jest.Mock).mockReturnValue(mockKey);
    await deleteStoreEntry(mockContext);
    expect(redisDel).toHaveBeenCalledWith(mockKey);
  });

  it('should throw an error if session key is not found', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);
    await expect(deleteStoreEntry(mockContext)).rejects.toThrow(
      '[deleteStoreEntry] No session key found in context',
    );
    expect(redisDel).not.toHaveBeenCalled();
  });
});
