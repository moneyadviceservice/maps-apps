import { BACKEND_TIMEOUT_SECONDS } from '../constants';
import { isSessionExpired } from './isSessionExpired';

describe('isSessionExpired', () => {
  const mockNow = 1000000000; // Fixed timestamp for consistent testing

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each`
    description                                             | sessionStart                                                   | expected
    ${'should return false when sessionStart is empty'}     | ${''}                                                          | ${false}
    ${'should return false when sessionStart is undefined'} | ${undefined}                                                   | ${false}
    ${'should return false when session is not expired'}    | ${(mockNow - (BACKEND_TIMEOUT_SECONDS - 1) * 1000).toString()} | ${false}
    ${'should return true when session is exactly expired'} | ${(mockNow - BACKEND_TIMEOUT_SECONDS * 1000).toString()}       | ${true}
    ${'should return true when session is over expired'}    | ${(mockNow - (BACKEND_TIMEOUT_SECONDS + 1) * 1000).toString()} | ${true}
  `('$description', async ({ sessionStart, expected }) => {
    const result = await isSessionExpired(sessionStart);
    expect(result).toBe(expected);
  });

  test('should handle invalid sessionStart format', async () => {
    const result = await isSessionExpired('invalid-timestamp');
    expect(result).toBe(false); // parseInt('invalid-timestamp') returns NaN, NaN comparisons are always false
  });

  test('should handle negative timestamps', async () => {
    const result = await isSessionExpired('-1000');
    expect(result).toBe(true); // Negative timestamp makes duration very large (current time - negative = large positive)
  });
});
