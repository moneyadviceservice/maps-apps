import { getSessionId } from '.';
import { mockContext, mockEntry, mockSessionId } from '../mocks';
import { getStoreEntry } from '../store';
import { getBackStep } from './getBackStep';

jest.mock('../store/getStoreEntry');
jest.mock('./getSessionId');
jest.mock('../utils');

describe('getBackStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (getStoreEntry as jest.Mock).mockResolvedValue({
      ...mockEntry,
      stepIndex: 2,
    });
  });

  it('should return the previous step if all conditions are met', async () => {
    // Default stepIndex is 2, set in beforeEach
    const result = await getBackStep(mockContext);

    expect(result).toBe('step-1');
  });

  it('should return null if the current step is the first step', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValue({
      ...mockEntry,
      stepIndex: 0, // Set to first step
    });
    const result = await getBackStep(mockContext);

    expect(result).toBeNull();
  });
});
