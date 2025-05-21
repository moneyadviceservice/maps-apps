import { GetServerSidePropsContext } from 'next';

import { Entry } from '../lib/types';
import { getSessionId } from '../lib/utils';
import { getStoreEntry } from '../store';
import { enquiryTypeGuard } from './enquiryTypeGuard';

jest.mock('../lib/utils');
jest.mock('../store');

describe('enquiryTypeGuard', () => {
  let mockEntry: Entry;
  const mockContext = {} as GetServerSidePropsContext;
  const mockSessionId = 'test-session-id';
  const mockStore = {
    setJSON: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockEntry = {
      data: { flow: 'test-route-flow', lang: 'en' },
      stepIndex: 0,
      errors: [],
    };
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: mockEntry,
      store: mockStore,
    });
  });

  it('should clear out the store data except for flow and lang when key and entry exist and there are no errors', async () => {
    await enquiryTypeGuard(mockContext);

    expect(mockStore.setJSON).toHaveBeenCalledWith(mockSessionId, {
      ...mockEntry,
      data: {
        flow: 'test-route-flow',
        lang: 'en',
      },
    });
  });
  it('should not clear out the store data when there is no entry', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {} as Entry,
      store: mockStore,
    });

    await enquiryTypeGuard(mockContext);

    expect(getSessionId).toHaveBeenCalledWith(mockContext);
    expect(getStoreEntry).toHaveBeenCalledWith(mockSessionId);
    expect(mockStore.setJSON).not.toHaveBeenCalled();
  });

  it('should not clear out the store data when there are errors', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {
        ...mockEntry,
        errors: [
          { field: 'field-1', message: 'Field 1 is required' },
          { field: 'field-2', message: 'Field 2 is required' },
        ],
      },
      store: mockStore,
    });

    await enquiryTypeGuard(mockContext);

    expect(getSessionId).toHaveBeenCalledWith(mockContext);
    expect(getStoreEntry).toHaveBeenCalledWith(mockSessionId);
    expect(mockStore.setJSON).not.toHaveBeenCalled();
  });

  it('should not clear out the store data when key is null', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);

    await enquiryTypeGuard(mockContext);

    expect(getStoreEntry).toHaveBeenCalledWith(null);
    expect(mockStore.setJSON).not.toHaveBeenCalled();
  });
});
