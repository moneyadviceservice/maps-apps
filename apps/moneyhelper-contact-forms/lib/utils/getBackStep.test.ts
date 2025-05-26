import { GetServerSidePropsContext } from 'next';

import { getCurrentStep, getFlowSteps, getSessionId } from '.';
import { getStoreEntry } from '../../store';
import { Entry } from '../types';
import { getBackStep } from './getBackStep';

jest.mock('../../store/getStoreEntry');
jest.mock('./getSessionId');
jest.mock('../utils');

describe('getBackStep', () => {
  const mockSessionId = 'test-session-id';
  const mockFlow = ['step-0', 'step-1', 'step-2'];
  let mockEntry: Entry;
  const mockContext = {
    res: {},
  } as GetServerSidePropsContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEntry = {
      data: { flow: 'test-route-flow', lang: 'en' },
      stepIndex: 2,
      errors: [],
    };

    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({ entry: mockEntry });
    (getFlowSteps as jest.Mock).mockReturnValue(mockFlow);
  });

  it('should return the previous step if all conditions are met', async () => {
    const mockCurrentStep = 'step-2';

    (getCurrentStep as jest.Mock).mockReturnValue(mockCurrentStep);

    const result = await getBackStep(mockContext);

    expect(result).toBe('step-1');
  });

  it('should return null if the current step is the first step', async () => {
    mockEntry.stepIndex = 0;
    const mockCurrentStep = 'step-0';

    (getCurrentStep as jest.Mock).mockReturnValue(mockCurrentStep);

    const result = await getBackStep(mockContext);

    expect(result).toBeNull();
  });
});
