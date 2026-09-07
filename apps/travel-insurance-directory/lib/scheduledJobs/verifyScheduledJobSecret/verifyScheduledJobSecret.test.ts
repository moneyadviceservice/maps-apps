import { verifyScheduledJobSecret } from './verifyScheduledJobSecret';

describe('verifyScheduledJobSecret', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.VALIDATE_FIRM_API_SECRET = 'super-secret-key-123';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('parameterized secret checks', () => {
    const testCases: Array<{
      description: string;
      input: string | string[] | undefined;
      expected: boolean;
    }> = [
      {
        description: 'provided secret matches expected secret',
        input: 'super-secret-key-123',
        expected: true,
      },
      {
        description: 'secret is provided as an array and first item matches',
        input: ['super-secret-key-123'],
        expected: true,
      },
      {
        description: 'provided secret does not match',
        input: 'wrong-secret-key-123',
        expected: false,
      },
      {
        description: 'length differs from expected secret',
        input: 'short',
        expected: false,
      },
      {
        description: 'receivedSecret is undefined',
        input: undefined,
        expected: false,
      },
      {
        description: 'receivedSecret is an empty string',
        input: '',
        expected: false,
      },
      {
        description: 'receivedSecret is an empty array',
        input: [],
        expected: false,
      },
    ];

    it.each(testCases)(
      'returns $expected when $description',
      ({ input, expected }) => {
        expect(verifyScheduledJobSecret(input)).toBe(expected);
      },
    );
  });

  describe('environment fallback behavior', () => {
    it.each([
      { input: '', expected: true },
      { input: 'some-key', expected: false },
    ])(
      'returns $expected for input "$input" when env variable is missing',
      ({ input, expected }) => {
        delete process.env.VALIDATE_FIRM_API_SECRET;
        expect(verifyScheduledJobSecret(input)).toBe(expected);
      },
    );
  });
});
