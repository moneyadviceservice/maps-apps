import { DEFAULT_LOAD_TIME } from '../constants';
import { PensionsDataLoadTimes } from '../types';
import { getLoadTimes } from './get-load-times';
import { getPensionData, UserSession } from './get-pensions-data';

jest.mock('./get-pensions-data');

const mockUserSession: UserSession = {
  userSessionId: 'test-session-id',
  authorizationCode: 'test-auth-code',
};

describe('getLoadTimes', () => {
  it('should return the predicted load times from getPensionData', async () => {
    (getPensionData as jest.Mock).mockResolvedValue({
      predictedTotalDataRetrievalTime: 100,
      predictedRemainingDataRetrievalTime: 50,
    });
    const result = await getLoadTimes(mockUserSession);
    expect(result).toEqual({
      expectedTime: 100,
      remainingTime: 50,
    });
  });

  it('should use default time if getPensionData does not provide times', async () => {
    (getPensionData as jest.Mock).mockResolvedValue({});
    const result = await getLoadTimes(mockUserSession);
    expect(result).toEqual({
      expectedTime: DEFAULT_LOAD_TIME,
      remainingTime: DEFAULT_LOAD_TIME,
    } as PensionsDataLoadTimes);
  });

  it('should use the predicted remaining time as the total expected if remaining time is greater than expected total time', async () => {
    (getPensionData as jest.Mock).mockResolvedValue({
      predictedTotalDataRetrievalTime: 100,
      predictedRemainingDataRetrievalTime: 150,
    });
    const result = await getLoadTimes(mockUserSession);
    expect(result).toEqual({
      expectedTime: 150,
      remainingTime: 150,
    } as PensionsDataLoadTimes);
  });
});
