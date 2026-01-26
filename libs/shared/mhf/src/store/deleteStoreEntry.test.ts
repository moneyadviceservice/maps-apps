import { redisDel } from '@maps-react/redis/helpers';

import { mockContext, mockSessionId } from '../mocks';
import { getSessionId } from '../utils';
import { deleteStoreEntry } from './deleteStoreEntry';

jest.mock('@maps-react/redis/helpers', () => ({
  redisDel: jest.fn(),
}));
jest.mock('../utils', () => ({
  getSessionId: jest.fn(),
}));

describe('deleteStoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call redisDel with the session key', async () => {
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    await deleteStoreEntry(mockContext);
    expect(redisDel).toHaveBeenCalledWith(mockSessionId);
  });

  it('should throw an error if session key is not found', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);
    await expect(deleteStoreEntry(mockContext)).rejects.toThrow(
      '[deleteStoreEntry] No session key found in context',
    );
    expect(redisDel).not.toHaveBeenCalled();
  });
});
