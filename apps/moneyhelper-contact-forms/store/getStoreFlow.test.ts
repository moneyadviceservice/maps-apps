import { GetServerSidePropsContext } from 'next';

import { Entry } from '../lib/types';
import { getSessionId } from '../lib/utils/getSessionId';
import { getStoreEntry } from './getStoreEntry';
import { getStoreFlow } from './getStoreFlow';

jest.mock('../lib/utils/getSessionId');
jest.mock('./getStoreEntry');

describe('getStoreFlow', () => {
  const mockContext = {} as GetServerSidePropsContext;
  const mockSessionId = 'test-session-id';
  const mockEntry = {
    data: {
      flow: 'test-route-flow',
    },
  } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();

    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({ entry: mockEntry });
  });
  it('should retrieve the routeFlowValue from the store entry', async () => {
    const result = await getStoreFlow(mockContext);

    expect(result).toBe('test-route-flow');
  });
  it('shoud return null if the entry is empty', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({ entry: {} });

    const result = await getStoreFlow(mockContext);

    expect(result).toBe(null);
  });
});
