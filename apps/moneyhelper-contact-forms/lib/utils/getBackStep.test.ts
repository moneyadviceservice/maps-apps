import { GetServerSidePropsContext } from 'next';

import { getFlowSteps, getSessionId } from '.';
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
      errors: {},
    };

    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue(mockEntry);
    (getFlowSteps as jest.Mock).mockReturnValue(mockFlow);
  });

  it('should return the previous step if all conditions are met', async () => {
    // Default stepIndex is 2, set in beforeEach

    const result = await getBackStep(mockContext);

    expect(result).toBe('step-1');
  });

  it('should return null if the current step is the first step', async () => {
    mockEntry.stepIndex = 0; // Set to first step

    const result = await getBackStep(mockContext);

    expect(result).toBeNull();
  });
});
