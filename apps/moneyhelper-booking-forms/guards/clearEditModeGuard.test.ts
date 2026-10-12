import { GetServerSidePropsContext } from 'next';

import { mockContext, mockEntry, mockSessionId } from '@maps-react/mhf/mocks';
import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { StepName } from '../lib/constants';
import { clearEditModeGuard } from './clearEditModeGuard';

jest.mock('@maps-react/mhf/store', () => ({
  getStoreEntry: jest.fn(),
  setStoreEntry: jest.fn(),
}));

jest.mock('@maps-react/mhf/utils', () => ({
  getCurrentStep: jest.fn(),
  getSessionId: jest.fn(),
}));

const mockGetStoreEntry = getStoreEntry as jest.Mock;
const mockSetStoreEntry = setStoreEntry as jest.Mock;
const mockGetCurrentStep = getCurrentStep as jest.Mock;
const mockGetSessionId = getSessionId as jest.Mock;

describe('clearEditModeGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionId.mockReturnValue(mockSessionId);
    mockGetCurrentStep.mockReturnValue(StepName.CONFIRM_DETAILS);
    mockGetStoreEntry.mockResolvedValue({
      ...mockEntry,
      editMode: true,
    });
  });

  it('clears editMode when on confirm-details and editMode=true', async () => {
    await clearEditModeGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        editMode: false,
      }),
    );
  });

  it('does not update store when current step is not confirm-details', async () => {
    mockGetCurrentStep.mockReturnValue(StepName.CONTACT_DETAILS);

    await clearEditModeGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not update store when session key is missing', async () => {
    mockGetSessionId.mockReturnValue(null);

    await clearEditModeGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not update store when editMode is already false', async () => {
    mockGetStoreEntry.mockResolvedValue({
      ...mockEntry,
      editMode: false,
    });

    await clearEditModeGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });
});
