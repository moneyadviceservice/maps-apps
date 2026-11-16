import { postQuestionnaireSubmission } from './beacon-service';

const payload = {
  flow: 'base',
  locale: 'en',
  questionnaireVersion: 'v1',
  questionnaireSessionId: 'session-1',
  consent: { termsAndConditions: 'true' },
  personalDetails: {
    firstName: 'Test',
    lastName: 'User',
    emailAddress: 'test@example.com',
  },
  answers: { ageRange: '35-49' },
};

describe('postQuestionnaireSubmission', () => {
  const originalEnv = process.env;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    mockFetch = global.fetch as jest.Mock;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    process.env = {
      ...originalEnv,
      MHPD_BEACON_SERVICE: 'https://beacon.test',
      MHPD_BEACON_SERVICE_API_KEY: 'test-function-key',
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  it('posts the session payload and succeeds on HTTP 200', async () => {
    mockFetch.mockResolvedValue({ status: 200 });

    await expect(postQuestionnaireSubmission(payload)).resolves.toBeUndefined();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://beacon.test/questionnaire-submission',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-functions-key': 'test-function-key',
        },
        body: JSON.stringify(payload),
      },
    );
  });

  it('fails when the function key is not configured', async () => {
    delete process.env.MHPD_BEACON_SERVICE_API_KEY;

    await expect(postQuestionnaireSubmission(payload)).rejects.toThrow(
      'MHPD_BEACON_SERVICE_API_KEY is not configured',
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fails when the service URL is not configured', async () => {
    delete process.env.MHPD_BEACON_SERVICE;

    await expect(postQuestionnaireSubmission(payload)).rejects.toThrow(
      'MHPD_BEACON_SERVICE is not configured',
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it.each([201, 204, 400, 503])(
    'fails when Beacon returns HTTP %s',
    async (status) => {
      mockFetch.mockResolvedValue({ status });

      await expect(postQuestionnaireSubmission(payload)).rejects.toThrow(
        'Questionnaire submission failed',
      );
    },
  );

  it('strips a trailing slash from the service URL', async () => {
    process.env.MHPD_BEACON_SERVICE = 'https://beacon.test/';
    mockFetch.mockResolvedValue({ status: 200 });

    await postQuestionnaireSubmission(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://beacon.test/questionnaire-submission',
      expect.any(Object),
    );
  });

  it('fails when the request throws', async () => {
    mockFetch.mockRejectedValue(new Error('network'));

    await expect(postQuestionnaireSubmission(payload)).rejects.toThrow(
      'Questionnaire submission failed',
    );
  });
});
