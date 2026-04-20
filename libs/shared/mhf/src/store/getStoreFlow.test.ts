import { mockContext, mockEntry, mockFlow, mockSessionId } from '../mocks';
import { getSessionId } from '../utils/getSessionId';
import { getStoreEntry } from './getStoreEntry';
import { getStoreFlow } from './getStoreFlow';

jest.mock('../utils/getSessionId');
jest.mock('./getStoreEntry');

describe('getStoreFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue(mockEntry);
  });
  it('should retrieve the routeFlowValue from the store entry', async () => {
    const result = await getStoreFlow(mockContext);

    expect(result).toBe(mockFlow);
  });
  it('shoud return null if the entry is empty', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({});

    const result = await getStoreFlow(mockContext);

    expect(result).toBe(null);
  });
});
