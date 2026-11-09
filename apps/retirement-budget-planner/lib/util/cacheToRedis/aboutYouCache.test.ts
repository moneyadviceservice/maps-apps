import { redisRestGet, redisRestSet } from '@maps-react/redis/rest-client';
import { getPartnersFromRedis, setPartnersInRedis } from './aboutYouCache';
import { Partner } from 'lib/types/aboutYou';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn().mockResolvedValue({}),
  redisRestSet: jest.fn().mockResolvedValue({}),
}));

const mockSuccessResponse = (responseValue?: unknown) => {
  return {
    success: true,
    data: {
      value: responseValue,
    },
  };
};

const mockFailedResponse = (errorMessage?: string) => {
  return {
    success: false,
    error: errorMessage,
  };
};

const mockErrorMessage = 'mock error';
const mockError = new Error(mockErrorMessage);

const mockSessionId = 'abcdefghijklmnopqrstuvwxyz012345';

const mockPartner: Partner = {
  id: 10,
  dob: { day: '01', month: '01', year: '1980' },
  gender: 'male',
  retireAge: '67',
};

describe('Utility function for About You data to retrieve from Redis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get the about data from redis', async () => {
    (redisRestGet as jest.Mock).mockResolvedValue(
      mockSuccessResponse(JSON.stringify(mockPartner)),
    );
    const partner = await getPartnersFromRedis(mockSessionId);

    expect(partner).toMatchObject({
      id: 10,
      dob: { day: '01', month: '01', year: '1980' },
      gender: 'male',
      retireAge: '67',
    });
  });

  it('should return default values for one partner if request returns null', async () => {
    (redisRestGet as jest.Mock).mockResolvedValue(mockSuccessResponse(null));
    const partner = await getPartnersFromRedis(mockSessionId);

    expect(partner).toMatchObject({
      id: 1,
      dob: { day: '', month: '', year: '' },
      gender: '',
      retireAge: '',
    });
  });

  it('should throw specific error when the request does not succeed', async () => {
    (redisRestGet as jest.Mock).mockResolvedValue(
      mockFailedResponse(mockErrorMessage),
    );

    await expect(getPartnersFromRedis(mockSessionId)).rejects.toThrow(
      mockErrorMessage,
    );
  });

  it('should throw default error when the request does not succeed', async () => {
    (redisRestGet as jest.Mock).mockResolvedValue(mockFailedResponse());

    await expect(getPartnersFromRedis(mockSessionId)).rejects.toThrow();
  });

  it('should throw error when the request throws', async () => {
    (redisRestGet as jest.Mock).mockRejectedValue(mockError);

    await expect(getPartnersFromRedis(mockSessionId)).rejects.toThrow();
  });

  it('should return null if sessionId is invalid', async () => {
    const nullResponse = await getPartnersFromRedis('');

    expect(nullResponse).toBeNull();
  });
});

describe('Utility function for About You data to save to Redis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set the about you data in redis', async () => {
    (redisRestSet as jest.Mock).mockResolvedValue(mockSuccessResponse());
    await setPartnersInRedis(mockPartner, mockSessionId);

    expect(redisRestSet).toHaveBeenCalledWith(
      `about-you:${mockSessionId}`,
      JSON.stringify(mockPartner),
    );
  });

  it('should throw error when setting partner details in redis fails', async () => {
    (redisRestSet as jest.Mock).mockResolvedValue(mockFailedResponse());

    await expect(
      setPartnersInRedis(mockPartner, mockSessionId),
    ).rejects.toThrow();
  });

  it('should throw error and log to console when setting partner details in redis fails with error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockError = new Error('Redis connection failed');
    (redisRestSet as jest.Mock).mockRejectedValue(mockError);

    await expect(
      setPartnersInRedis(mockPartner, mockSessionId),
    ).rejects.toThrow(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error setting partner details in Redis:',
      mockError,
    );

    consoleErrorSpy.mockRestore();
  });
});
