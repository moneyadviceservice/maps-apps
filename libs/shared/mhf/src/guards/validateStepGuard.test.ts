import { GetServerSidePropsContext } from 'next';

import { mockEntry, mockSessionId } from '../mocks';
import { getStoreEntry, setStoreEntry } from '../store';
import { getCurrentStep, getSessionId } from '../utils';
import { validateStepGuard } from './validateStepGuard';

jest.mock('../store', () => ({
  getStoreEntry: jest.fn(),
  setStoreEntry: jest.fn(),
}));

jest.mock('../utils', () => ({
  getCurrentStep: jest.fn(),
  getSessionId: jest.fn(),
}));

describe('validateStepGuard', () => {
  const mockContext = {
    res: { writeHead: jest.fn(), end: jest.fn() },
  } as unknown as GetServerSidePropsContext;

  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({
      ...mockEntry,
      stepIndex: 1,
    });
  });

  it('should return early if steps is undefined', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({
      ...mockEntry,
      steps: undefined,
    });
    await validateStepGuard(mockContext);
    expect(getCurrentStep).not.toHaveBeenCalled();
    expect(setStoreEntry).not.toHaveBeenCalled();
  });

  it('should perform a redirect if the user tries to skip forward in the flow', async () => {
    (getCurrentStep as jest.Mock).mockReturnValue('step-2');
    await validateStepGuard(mockContext);
    expect(mockContext.res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/step-1',
    });
    expect(mockContext.res.end).toHaveBeenCalled();
  });

  it('should update the currentStepIndex and clear errors if the currentStepIndex and the entry stepIndex are different', async () => {
    (getCurrentStep as jest.Mock).mockReturnValue('step-0');
    await validateStepGuard(mockContext);
    expect(setStoreEntry).toHaveBeenCalledWith(mockSessionId, {
      ...mockEntry,
      stepIndex: 0,
    });
  });

  it('should not update the currentStepIndex and clear errors if the key is null', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);
    (getCurrentStep as jest.Mock).mockReturnValue('step-0');
    await validateStepGuard(mockContext);
    expect(setStoreEntry).not.toHaveBeenCalled();
  });

  it('should throw an error if the step is invalid', async () => {
    (getCurrentStep as jest.Mock).mockReturnValue('invalid-step');
    await expect(validateStepGuard(mockContext)).rejects.toThrow(
      'Invalid step: invalid-step',
    );
  });
});
