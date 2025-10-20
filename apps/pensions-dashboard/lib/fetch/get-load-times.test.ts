import { DEFAULT_LOAD_TIME } from '../constants';
import { PensionData } from '../types';
import { getLoadTimes } from './get-load-times';
import { getPensionData, UserSession } from './get-pensions-data';

jest.mock('./get-pensions-data');

const mockGetPensionData = getPensionData as jest.MockedFunction<
  typeof getPensionData
>;

const mockUserSession: UserSession = {
  userSessionId: 'test-session-id',
  authorizationCode: 'test-auth-code',
  sessionStart: '',
};

describe('getLoadTimes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    description                                                                 | mockData                                                                                | expectedResult
    ${'should return the predicted load times from getPensionData'}             | ${{ predictedTotalDataRetrievalTime: 100, predictedRemainingDataRetrievalTime: 50 }}    | ${{ expectedTime: 100, remainingTime: 50 }}
    ${'should use default time when both times are undefined'}                  | ${{}}                                                                                   | ${{ expectedTime: DEFAULT_LOAD_TIME, remainingTime: DEFAULT_LOAD_TIME }}
    ${'should use default time when both times are null'}                       | ${{ predictedTotalDataRetrievalTime: null, predictedRemainingDataRetrievalTime: null }} | ${{ expectedTime: DEFAULT_LOAD_TIME, remainingTime: DEFAULT_LOAD_TIME }}
    ${'should use default for total time only when total is undefined'}         | ${{ predictedRemainingDataRetrievalTime: 75 }}                                          | ${{ expectedTime: DEFAULT_LOAD_TIME, remainingTime: 75 }}
    ${'should use default for remaining time only when remaining is undefined'} | ${{ predictedTotalDataRetrievalTime: 120 }}                                             | ${{ expectedTime: 120, remainingTime: DEFAULT_LOAD_TIME }}
    ${'should use remaining time as expected when remaining > total'}           | ${{ predictedTotalDataRetrievalTime: 100, predictedRemainingDataRetrievalTime: 150 }}   | ${{ expectedTime: 150, remainingTime: 150 }}
    ${'should handle zero values correctly'}                                    | ${{ predictedTotalDataRetrievalTime: 0, predictedRemainingDataRetrievalTime: 0 }}       | ${{ expectedTime: 0, remainingTime: 0 }}
    ${'should handle mixed zero and positive values'}                           | ${{ predictedTotalDataRetrievalTime: 0, predictedRemainingDataRetrievalTime: 50 }}      | ${{ expectedTime: 50, remainingTime: 50 }}
  `('$description', async ({ mockData, expectedResult }) => {
    mockGetPensionData.mockResolvedValue(mockData);

    const result = await getLoadTimes(mockUserSession);

    expect(result).toEqual(expectedResult);
    expect(mockGetPensionData).toHaveBeenCalledWith({
      userSession: mockUserSession,
    });
  });

  test('should handle null response from getPensionData', async () => {
    mockGetPensionData.mockResolvedValue(null as unknown as PensionData);

    const result = await getLoadTimes(mockUserSession);

    expect(result).toEqual({
      expectedTime: DEFAULT_LOAD_TIME,
      remainingTime: DEFAULT_LOAD_TIME,
    });
  });

  test('should handle undefined response from getPensionData', async () => {
    mockGetPensionData.mockResolvedValue(undefined as unknown as PensionData);

    const result = await getLoadTimes(mockUserSession);

    expect(result).toEqual({
      expectedTime: DEFAULT_LOAD_TIME,
      remainingTime: DEFAULT_LOAD_TIME,
    });
  });

  test('should propagate errors from getPensionData', async () => {
    const error = new Error('Failed to get pension data');
    mockGetPensionData.mockRejectedValue(error);

    await expect(getLoadTimes(mockUserSession)).rejects.toThrow(
      'Failed to get pension data',
    );
  });
});
