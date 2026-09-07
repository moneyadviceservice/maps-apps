import { GetServerSidePropsContext } from 'next';

import { mockContext, mockEntry, mockSessionId } from '@maps-react/mhf/mocks';
import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import {
  getCurrentStep,
  getLanguage,
  getSessionId,
} from '@maps-react/mhf/utils';

import { JourneyType, StepName } from '../lib/constants';
import { journeyEntryGuard } from './journeyEntryGuard';

jest.mock('@maps-react/mhf/store', () => ({
  getStoreEntry: jest.fn(),
  setStoreEntry: jest.fn(),
}));

jest.mock('@maps-react/mhf/utils', () => ({
  getCurrentStep: jest.fn(),
  getLanguage: jest.fn(),
  getSessionId: jest.fn(),
}));

const mockGetStoreEntry = getStoreEntry as jest.Mock;
const mockSetStoreEntry = setStoreEntry as jest.Mock;
const mockGetCurrentStep = getCurrentStep as jest.Mock;
const mockGetLanguage = getLanguage as jest.Mock;
const mockGetSessionId = getSessionId as jest.Mock;

describe('journeyEntryGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionId.mockReturnValue(mockSessionId);
    mockGetCurrentStep.mockReturnValue(StepName.FIND_APPOINTMENT);
    mockGetLanguage.mockReturnValue('en');
    mockGetStoreEntry.mockResolvedValue({
      ...mockEntry,
      data: {
        ...mockEntry.data,
        journeyType: JourneyType.BASE,
      },
      errors: { flow: ['Select an appointment type'] },
      stepIndex: 1,
      steps: [StepName.APPOINTMENT_TYPE, StepName.CONTACT_DETAILS],
    });
  });

  it('resets an existing entry when entering a different journey', async () => {
    await journeyEntryGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).toHaveBeenCalledWith(mockSessionId, {
      data: {
        flow: '',
        locale: 'en',
        journeyType: JourneyType.CHANGE,
      },
      errors: {},
      stepIndex: 0,
      steps: [StepName.FIND_APPOINTMENT],
    });
  });

  it('does not reset an entry already in the requested journey', async () => {
    mockGetStoreEntry.mockResolvedValue({
      ...mockEntry,
      data: {
        ...mockEntry.data,
        journeyType: JourneyType.CHANGE,
      },
    });

    await journeyEntryGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not reset when the current step does not start a journey', async () => {
    mockGetCurrentStep.mockReturnValue('UNKNOWN_STEP');

    await journeyEntryGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );
    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not reset when there is no session', async () => {
    mockGetSessionId.mockReturnValue(null);

    await journeyEntryGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockGetStoreEntry).not.toHaveBeenCalled();
    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not reset when the session has no entry', async () => {
    mockGetStoreEntry.mockResolvedValue(undefined);

    await journeyEntryGuard(
      mockContext as unknown as GetServerSidePropsContext,
    );

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });
});
