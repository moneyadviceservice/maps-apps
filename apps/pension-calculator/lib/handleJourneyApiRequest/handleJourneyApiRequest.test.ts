import type { NextApiRequest, NextApiResponse } from 'next';

import {
  parseJourneyApiRequest,
  rejectIfNotPost,
  sendJourneyResult,
} from './handleJourneyApiRequest';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}));

const mockResponse = () => {
  const response = {
    setHeader: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
  };

  return response as unknown as NextApiResponse & typeof response;
};

describe('rejectIfNotPost', () => {
  it('rejects non-POST with 405 and allows POST', () => {
    const rejected = mockResponse();
    expect(rejectIfNotPost({ method: 'GET' } as NextApiRequest, rejected)).toBe(
      true,
    );
    expect(rejected.status).toHaveBeenCalledWith(405);

    const allowed = mockResponse();
    expect(rejectIfNotPost({ method: 'POST' } as NextApiRequest, allowed)).toBe(
      false,
    );
    expect(allowed.status).not.toHaveBeenCalled();
  });
});

describe('parseJourneyApiRequest', () => {
  const actions = new Set(['continue', 'save'] as const);

  it('defaults unknown actions and reads a valid action with JSON content type', () => {
    expect(
      parseJourneyApiRequest(
        {
          query: { action: 'nope' },
          body: { language: 'cy', sessionId: 'abc' },
          headers: {},
        } as unknown as NextApiRequest,
        actions,
        'continue',
      ),
    ).toEqual({
      body: { language: 'cy', sessionId: 'abc' },
      jsonRequest: false,
      action: 'continue',
      language: 'cy',
      sessionId: 'abc',
    });

    const parsed = parseJourneyApiRequest(
      {
        query: { action: 'save' },
        body: { sessionId: 'abc' },
        headers: { 'content-type': 'application/json' },
      } as unknown as NextApiRequest,
      actions,
      'continue',
    );

    expect(parsed.action).toBe('save');
    expect(parsed.jsonRequest).toBe(true);
  });
});

describe('sendJourneyResult', () => {
  it('returns JSON for JSON requests and redirects form posts', () => {
    const jsonResponse = mockResponse();
    sendJourneyResult(jsonResponse, true, {
      valid: true,
      redirectPath: '/en/save',
      errors: {},
    });
    expect(jsonResponse.json).toHaveBeenCalledWith({
      success: true,
      redirectPath: '/en/save',
      errors: {},
    });

    const formResponse = mockResponse();
    sendJourneyResult(formResponse, false, {
      valid: true,
      redirectPath: '/en/save',
    });
    expect(formResponse.redirect).toHaveBeenCalledWith(303, '/en/save');
  });
});
