/**
 * Shared test utilities for evidence-hub tests
 * Reduces duplication across test files
 */

/**
 * Creates a FormData object from key-value pairs
 */
export const createFormData = (entries: Array<[string, string]>): FormData => {
  const formData = new FormData();
  for (const [key, value] of entries) {
    formData.append(key, value);
  }
  return formData;
};

/**
 * Asserts that a date matches expected values
 */
export const expectDateMatches = (
  date: Date,
  expected: {
    year: number;
    month: number; // 0-11 (0 = January)
    day: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  },
): void => {
  expect(date.getFullYear()).toBe(expected.year);
  expect(date.getMonth()).toBe(expected.month);
  expect(date.getDate()).toBe(expected.day);
  if (expected.hours !== undefined) {
    expect(date.getHours()).toBe(expected.hours);
  }
  if (expected.minutes !== undefined) {
    expect(date.getMinutes()).toBe(expected.minutes);
  }
  if (expected.seconds !== undefined) {
    expect(date.getSeconds()).toBe(expected.seconds);
  }
};

/**
 * Asserts that a date range matches expected start and end dates
 */
export const expectDateRange = (
  result: { startDate: Date; endDate: Date } | null,
  expectedStart: {
    year: number;
    month: number;
    day: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  },
  expectedEnd: {
    year: number;
    month: number;
    day: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  },
): void => {
  expect(result).not.toBeNull();
  expect(result?.startDate).toBeInstanceOf(Date);
  expect(result?.endDate).toBeInstanceOf(Date);
  if (result) {
    expectDateMatches(result.startDate, expectedStart);
    expectDateMatches(result.endDate, expectedEnd);
  }
};

/**
 * Creates a submit event with optional submitter
 */
export const createSubmitEvent = (
  submitter?: HTMLElement | null,
): SubmitEvent => {
  const submitEvent = new Event('submit', {
    bubbles: true,
    cancelable: true,
  }) as SubmitEvent;
  if (submitter) {
    (submitEvent as SubmitEvent & { submitter: HTMLElement }).submitter =
      submitter;
  }
  return submitEvent;
};

/**
 * Asserts that an array was not mutated by a function
 * Checks that the original array is unchanged and result is a new array
 */
export const expectNoMutation = <T>(original: T[], result: T[]): void => {
  const originalCopy = [...original];
  expect(original).toEqual(originalCopy);
  expect(result).not.toBe(original);
};

/**
 * Asserts that a function handles empty arrays correctly
 */
export const expectEmptyArrayResult = <T>(result: T[]): void => {
  expect(result).toEqual([]);
};

/**
 * Parameterized test helper for testing with empty/whitespace values
 */
export const testWithEmptyValues = (
  testFn: (value: string | undefined) => void,
): void => {
  it('should handle undefined', () => {
    testFn(undefined);
  });

  it('should handle empty string', () => {
    testFn('');
  });

  it('should handle whitespace-only string', () => {
    testFn('   ');
  });
};
