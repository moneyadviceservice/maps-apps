import { loadEnv } from './loadEnv';

jest.mock('dotenv');
jest.mock('path');

describe('loadEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('should return the environment variables if all required variables are present', () => {
    process.env.STORE_NAME = 'mockStoreName';

    const result = loadEnv();

    expect(result).toEqual({
      name: 'mockStoreName',
    });
  });

  it('should throw an error if STORE_NAME is missing', () => {
    process.env.STORE_NAME = undefined;

    expect(() => loadEnv()).toThrow(
      'Missing required environment variable: STORE_NAME',
    );
  });
});
