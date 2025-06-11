import { GetServerSidePropsContext } from 'next';

import { Entry } from '../lib/types';
import {
  getCurrentStep,
  getFlowSteps,
  getSessionId,
  loadEnv,
} from '../lib/utils';
import { getStoreEntry } from '../store';
import { validateStepGuard } from './validateStepGuard';

jest.mock('@netlify/blobs');
jest.mock('../lib/utils');
jest.mock('../store');

describe('validateStepGuard', () => {
  const mockContext = {} as GetServerSidePropsContext;
  const mockSessionId = 'test-session-id';
  const mockSteps = ['step-0', 'step-1', 'step-2'];
  const mockStoreName = 'test-store';
  const mockEntry: Entry = {
    data: { flow: 'test-route-flow', lang: 'en' },
    stepIndex: 1, // Set the default step index to "step-1" for all tests
    errors: [],
  };
  const mockStore = {
    setJSON: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (loadEnv as jest.Mock).mockReturnValue({ name: mockStoreName });
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({ entry: mockEntry });
    (getFlowSteps as jest.Mock).mockReturnValue(mockSteps);
    (getStoreEntry as jest.Mock).mockResolvedValue({
      entry: mockEntry,
      store: mockStore,
    });
  });
  it('should perform a redirect if the user tries to skip forward in the flow', async () => {
    const mockRes = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const mockContext = {
      res: mockRes,
      req: {},
    } as unknown as GetServerSidePropsContext;

    (getCurrentStep as jest.Mock).mockReturnValue('step-2'); // User tries to skip forward and access "step-2"

    await validateStepGuard(mockContext);

    expect(mockRes.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/step-1',
    }); // ensure the stay on their current step
    expect(mockRes.end).toHaveBeenCalled();
  });

  it('should update the currentStepIndex and clear errors if the currentStepIndex and the entry stepIndex are different', async () => {
    (getCurrentStep as jest.Mock).mockReturnValue('step-0'); // User goes back to access "step-0"
    await validateStepGuard(mockContext);
    expect(mockStore.setJSON).toHaveBeenCalledWith(mockSessionId, {
      ...mockEntry,
      stepIndex: 0,
      errors: [],
    } as Entry);
  });

  it('should not update the currentStepIndex and clear errors if the key is null', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null); // Simulate a null session ID
    (getCurrentStep as jest.Mock).mockReturnValue('step-0'); // User goes back to access "step-0"
    await validateStepGuard(mockContext);
    expect(mockStore.setJSON).not.toHaveBeenCalled(); // Ensure that setJSON is not called
  });

  it('should throw an error if the step is invalid', async () => {
    (getCurrentStep as jest.Mock).mockReturnValue('invalid-step');
    (getStoreEntry as jest.Mock).mockResolvedValue({
      data: { lang: 'en' },
      currentStepIndex: 1,
    });

    await expect(validateStepGuard(mockContext)).rejects.toThrow(
      'Invalid step: invalid-step',
    );
  });
});
