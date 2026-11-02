import { GetServerSidePropsContext } from 'next';

import { mockContext, mockEntry, mockSessionId } from '@maps-react/mhf/mocks';
import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { StepName } from '../lib/constants';
import { editModeInitGuard } from './editModeInitGuard';

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

describe('editModeInitGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionId.mockReturnValue(mockSessionId);
    mockGetCurrentStep.mockReturnValue(StepName.CONTACT_DETAILS);
    mockGetStoreEntry.mockResolvedValue({
      ...mockEntry,
      data: { ...mockEntry.data },
    });
  });

  it('sets editMode when edit=true on an allowlisted step', async () => {
    const context = {
      ...mockContext,
      query: { edit: 'true' },
    } as unknown as GetServerSidePropsContext;

    await editModeInitGuard(context);

    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        editMode: true,
      }),
    );
  });

  it('sets editMode when edit query is an array containing true', async () => {
    const context = {
      ...mockContext,
      query: { edit: ['true'] },
    } as unknown as GetServerSidePropsContext;

    await editModeInitGuard(context);

    expect(mockSetStoreEntry).toHaveBeenCalledWith(
      mockSessionId,
      expect.objectContaining({
        editMode: true,
      }),
    );
  });

  it('does not set editMode when edit query is missing', async () => {
    const context = {
      ...mockContext,
      query: {},
    } as unknown as GetServerSidePropsContext;

    await editModeInitGuard(context);

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not set editMode when current step is not allowlisted', async () => {
    mockGetCurrentStep.mockReturnValue(StepName.ACCESS_BSL);
    const context = {
      ...mockContext,
      query: { edit: 'true' },
    } as unknown as GetServerSidePropsContext;

    await editModeInitGuard(context);

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not set editMode when there is no session id', async () => {
    mockGetSessionId.mockReturnValue(null);
    const context = {
      ...mockContext,
      query: { edit: 'true' },
    } as unknown as GetServerSidePropsContext;

    await editModeInitGuard(context);

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });

  it('does not set editMode when entry is missing', async () => {
    mockGetStoreEntry.mockResolvedValue(null);
    const context = {
      ...mockContext,
      query: { edit: 'true' },
    } as unknown as GetServerSidePropsContext;

    await editModeInitGuard(context);

    expect(mockSetStoreEntry).not.toHaveBeenCalled();
  });
});
