import { GetServerSidePropsContext } from 'next';

import { Entry } from '../lib/types';
import { getCurrentStep, getFlowSteps, getSessionId } from '../lib/utils';
import { getStoreEntry, setStoreEntry } from '../store';
import { validateStepGuard } from './validateStepGuard';

jest.mock('../store', () => ({
  getStoreEntry: jest.fn(),
  setStoreEntry: jest.fn(),
}));

jest.mock('../lib/utils', () => ({
  getCurrentStep: jest.fn(),
  getFlowSteps: jest.fn(),
  getSessionId: jest.fn(),
}));

describe('validateStepGuard', () => {
  const mockContext = {
    res: { writeHead: jest.fn(), end: jest.fn() },
  } as unknown as GetServerSidePropsContext;
  const mockSessionId = 'test-session-id';
  const mockSteps = ['step-0', 'step-1', 'step-2'];
  const mockEntry: Entry = {
    data: { flow: 'test-route-flow', lang: 'en' },
    stepIndex: 1,
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue(mockEntry);
    (getFlowSteps as jest.Mock).mockReturnValue(mockSteps);
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
      errors: {},
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
