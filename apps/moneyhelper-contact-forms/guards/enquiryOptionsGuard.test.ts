import { GetServerSidePropsContext } from 'next';

import { enquiryOptionsGuard } from '.';
import { SUB_TO_PARENT_FLOW_MAP } from '../lib/constants';
import { Entry } from '../lib/types';
import { getSessionId } from '../lib/utils';
import { getStoreEntry } from '../store';

jest.mock('../lib/utils');
jest.mock('../store');

describe('enquiryOptionsGuard', () => {
  const parentFlow = 'test-route-parent-flow';
  const subFlow = 'test-route-sub-flow';
  const mockEntry: Entry = {
    data: {
      flow: subFlow,
      lang: 'en',
      firstName: 'Paul',
      lastName: 'Smith',
    },
    stepIndex: 0,
    errors: [],
  };
  const mockContext = {} as GetServerSidePropsContext;
  const mockSessionId = 'test-session-id';
  const mockStore = {
    setJSON: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: mockEntry,
      store: mockStore,
    });
  });

  it('should clear out the store data except for flow and lang when key and entry exist and there are no errors', async () => {
    await enquiryOptionsGuard(mockContext);

    expect(mockStore.setJSON).toHaveBeenCalledWith(mockSessionId, {
      ...mockEntry,
      data: {
        flow: mockEntry.data.flow,
        lang: mockEntry.data.lang,
      },
    });
  });
  it('should not clear out the store data when there is no entry', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {} as Entry,
      store: mockStore,
    });

    await enquiryOptionsGuard(mockContext);

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

    await enquiryOptionsGuard(mockContext);

    expect(getSessionId).toHaveBeenCalledWith(mockContext);
    expect(getStoreEntry).toHaveBeenCalledWith(mockSessionId);
    expect(mockStore.setJSON).not.toHaveBeenCalled();
  });

  it('should not clear out the store data when key is null', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);

    await enquiryOptionsGuard(mockContext);

    expect(getStoreEntry).toHaveBeenCalledWith(null);
    expect(mockStore.setJSON).not.toHaveBeenCalled();
  });

  it('should use the map and replace the sub-flow with the parent flow if the flow is of sub-flow', async () => {
    SUB_TO_PARENT_FLOW_MAP[subFlow] = parentFlow;

    await enquiryOptionsGuard(mockContext);

    expect(mockStore.setJSON).toHaveBeenCalledWith(mockSessionId, {
      ...mockEntry,
      data: {
        flow: parentFlow,
        lang: mockEntry.data.lang,
      },
    });
  });

  it('should keep the original flow if flow is the parent flow', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {
        ...mockEntry,
        data: {
          ...mockEntry.data,
          flow: parentFlow,
        },
      },
      store: mockStore,
    });
    SUB_TO_PARENT_FLOW_MAP[subFlow] = parentFlow;

    await enquiryOptionsGuard(mockContext);

    expect(mockStore.setJSON).toHaveBeenCalledWith(mockSessionId, {
      ...mockEntry,
      data: {
        flow: parentFlow,
        lang: mockEntry.data.lang,
      },
    });
  });
});
