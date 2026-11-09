import { SubmissionState } from '@maps-react/mhf/constants';
import { setStoreEntry } from '@maps-react/mhf/store';
import { Entry } from '@maps-react/mhf/types';
import { redisRestDel } from '@maps-react/redis/rest-client';

import { postQuestionnaireSubmission } from '../api/beacon-service';
import { submitTakingPart } from './submitTakingPart';

jest.mock('@maps-react/mhf/store', () => ({
  setStoreEntry: jest.fn(),
}));

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestDel: jest.fn(),
}));

jest.mock('../api/beacon-service', () => ({
  postQuestionnaireSubmission: jest.fn(),
}));

const entry = {
  data: {
    flow: 'base',
    locale: 'cy',
    termsAndConditions: 'true',
    firstName: 'Test',
    lastName: 'User',
    emailAddress: 'test@example.com',
  },
  steps: ['submit'],
  stepIndex: 0,
  errors: {},
} as Entry;

const beaconCookie =
  'beaconId=; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax';
const clearedSessionCookie =
  'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax';

const redisDeleted = {
  success: true,
  data: { key: 'session-1', deletedCount: 1, site: 'test' },
};

describe('submitTakingPart', () => {
  const originalEnv = process.env;
  let res: { setHeader: jest.Mock };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-22T12:00:00.000Z'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    process.env = { ...originalEnv, COOKIE_NAME: 'fsid' };
    delete entry.meta;
    res = { setHeader: jest.fn() };
    jest.mocked(setStoreEntry).mockResolvedValue(undefined);
    jest.mocked(redisRestDel).mockResolvedValue(redisDeleted);
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env = originalEnv;
  });

  it('posts the stored session as the Beacon body', async () => {
    jest.mocked(postQuestionnaireSubmission).mockResolvedValue(undefined);

    const stored = {
      ...entry,
      data: {
        ...entry.data,
        locale: 'en',
        ageRange: '35-49',
        whereYouLive: 'england',
        yourSex: 'female',
        otherSex: '',
        healthConditions: 'no',
      },
    } as Entry;

    await submitTakingPart({
      entry: stored,
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(postQuestionnaireSubmission).toHaveBeenCalledWith({
      locale: 'en',
      questionnaireVersion: 'v1',
      personalDetails: {
        firstName: 'Test',
        lastName: 'User',
        emailAddress: 'test@example.com',
      },
      consent: {
        decision: 'agreed',
        version: 'v1',
        timestamp: '2026-10-22T12:00:00.000Z',
      },
      answers: {
        ageRange: '35-49',
        whereYouLive: 'england',
        yourSex: 'female',
        healthConditions: 'no',
      },
    });
  });

  it('omits a stored impact answer when health conditions are no', async () => {
    jest.mocked(postQuestionnaireSubmission).mockResolvedValue(undefined);

    await submitTakingPart({
      entry: {
        ...entry,
        data: {
          ...entry.data,
          healthConditions: 'no',
          healthConditionsImpact: 'yes',
        },
      },
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(postQuestionnaireSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: expect.not.objectContaining({
          healthConditionsImpact: expect.anything(),
        }),
      }),
    );
  });

  it('keeps a provided other-sex answer in the Beacon body', async () => {
    jest.mocked(postQuestionnaireSubmission).mockResolvedValue(undefined);

    await submitTakingPart({
      entry: {
        ...entry,
        data: { ...entry.data, yourSex: 'other', otherSex: 'Test' },
      },
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(postQuestionnaireSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: expect.objectContaining({
          yourSex: 'other',
          otherSex: 'Test',
        }),
      }),
    );
  });

  it('sets beaconId, clears the taking-part session, and redirects home', async () => {
    jest.mocked(postQuestionnaireSubmission).mockResolvedValue(undefined);

    const outcome = await submitTakingPart({
      entry,
      sessionKey: 'session-1',
      locale: 'cy',
      res,
    });

    expect(redisRestDel).toHaveBeenCalledWith('session-1');
    expect(outcome.redirect).toEqual({
      destination: '/cy',
      permanent: false,
    });
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
      beaconCookie,
      clearedSessionCookie,
    ]);
    expect(setStoreEntry).toHaveBeenLastCalledWith(
      'session-1',
      expect.objectContaining({
        meta: {
          submissionState: SubmissionState.SUCCEEDED,
          responseData: {},
          submissionKey: 'taking-part-submit',
        },
      }),
    );
  });

  it('still sets beaconId when clearing Redis fails', async () => {
    jest.mocked(postQuestionnaireSubmission).mockResolvedValue(undefined);
    jest.mocked(redisRestDel).mockResolvedValue({
      success: false,
      error: 'redis down',
    });

    const outcome = await submitTakingPart({
      entry,
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(outcome.redirect.destination).toBe('/en');
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
      beaconCookie,
      clearedSessionCookie,
    ]);
  });

  it('still sets beaconId when clearing Redis throws', async () => {
    jest.mocked(postQuestionnaireSubmission).mockResolvedValue(undefined);
    jest.mocked(redisRestDel).mockRejectedValue(new Error('redis down'));

    const outcome = await submitTakingPart({
      entry,
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(outcome.redirect.destination).toBe('/en');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.arrayContaining([expect.stringContaining('beaconId=;')]),
    );
  });

  it('redirects to the taking-part error page and does not set beaconId', async () => {
    jest
      .mocked(postQuestionnaireSubmission)
      .mockRejectedValue(new Error('Questionnaire submission failed'));

    const outcome = await submitTakingPart({
      entry,
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(redisRestDel).not.toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(outcome.redirect).toEqual({
      destination: '/en/taking-part/error',
      permanent: false,
    });
    expect(setStoreEntry).toHaveBeenLastCalledWith(
      'session-1',
      expect.objectContaining({
        meta: {
          submissionState: SubmissionState.FAILED,
          submissionKey: 'taking-part-submit',
          submissionErrorStatus: '104',
        },
      }),
    );
  });

  it('sends a fresh in-progress submission back to loading without posting again', async () => {
    const outcome = await submitTakingPart({
      entry: {
        ...entry,
        meta: {
          submissionState: SubmissionState.IN_PROGRESS,
          submissionKey: 'taking-part-submit',
          submissionStartedAt: new Date().toISOString(),
        },
      },
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(postQuestionnaireSubmission).not.toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(outcome.redirect).toEqual({
      destination: '/en/taking-part/loading',
      permanent: false,
    });
  });

  it('does not post again when the same submission has already succeeded', async () => {
    const outcome = await submitTakingPart({
      entry: {
        ...entry,
        meta: {
          submissionState: SubmissionState.SUCCEEDED,
          submissionKey: 'taking-part-submit',
          responseData: {},
        },
      },
      sessionKey: 'session-1',
      locale: 'en',
      res,
    });

    expect(postQuestionnaireSubmission).not.toHaveBeenCalled();
    expect(outcome.redirect.destination).toBe('/en');
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
      beaconCookie,
      clearedSessionCookie,
    ]);
  });
});
