import { getRedisClient } from './client';
import { redisDel, redisGet, redisSet } from './helpers';

jest.mock('./client');

const mockGet = jest.fn();
const mockSet = jest.fn();
const mockDel = jest.fn();

const testKey = 'mock-key';
const testValue = 'mock-value';

beforeEach(() => {
  jest.clearAllMocks();
  (getRedisClient as jest.Mock).mockResolvedValue({
    get: mockGet,
    set: mockSet,
    del: mockDel,
  });
});

describe('helpers', () => {
  it('calls client.get with the key', async () => {
    mockGet.mockResolvedValue(testValue);
    const result = await redisGet(testKey);
    expect(getRedisClient).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith(testKey);
    expect(result).toBe(testValue);
  });

  it('calls client.set with the key and value', async () => {
    mockSet.mockResolvedValue('OK');
    const result = await redisSet(testKey, testValue);
    expect(getRedisClient).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(testKey, testValue, {
      EX: 3600,
    });
    expect(result).toBe('OK');
  });

  it('calls client.set with expiry', async () => {
    await redisSet(testKey, testValue, 7200);
    expect(mockSet).toHaveBeenCalledWith(testKey, testValue, {
      EX: 7200,
    });
  });

  it('calls client.del with the key', async () => {
    mockDel.mockResolvedValue(1);
    const result = await redisDel(testKey);
    expect(getRedisClient).toHaveBeenCalled();
    expect(mockDel).toHaveBeenCalledWith(testKey);
    expect(result).toBe(1);
  });
});
