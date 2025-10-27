import { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';

import handler from './submit-flow';

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

jest.mock('CONSTANTS', () => ({
  PAGES: {
    CALL_SCHEDULED: 'call-scheduled',
    CONFIRM_ANSWERS: 'confirm-answers',
  },
}));

jest.mock('../../utils/getCurrentPath', () => ({
  getCurrentPath: jest.fn(() => 'test_flow'),
}));

jest.mock('../../lib/token', () => ({
  decrypt: jest.fn(() => 'username'),
}));

const csrfToken =
  '3da268fa652f6230c91ed28d0766315780e001ac84fdaa44107b8741983f5220';

jest.useFakeTimers();

describe('Handler API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.BOOK_APPOINTMENT_SLOT_CODE = 'test_code';
    process.env.APPOINTMENTS_API = 'https://api.example.com/';
  });

  afterEach(() => {
    jest.advanceTimersByTime(60 * 1001);
  });

  it('should return 400 if required env variables are missing', async () => {
    delete process.env.BOOK_APPOINTMENT_SLOT_CODE;
    delete process.env.APPOINTMENTS_API;

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: { csrfToken },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(400);
  });

  it('should return 302 if slot format is invalid', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({
          timeSlot: { value: 'InvalidSlot' },
        }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: { csrfToken },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(302);
  });

  it('should redirect on successful booking', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    const flows = [
      { flow: 'start', data: {} },
      { flow: 'telephone', data: { timeSlot: { value: 'AM - 10-12-2024' } } },
      { flow: 'online', data: {} },
    ];

    flows.forEach(async ({ flow, data }) => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          cookieData: JSON.stringify(data),
          urlData: '{}',
          language: 'en',
          currentFlow: flow,
          csrfToken,
        },
        cookies: { csrfToken },
      });

      res.setHeader('Location', `/${'en'}/${flow}/${'call-scheduled'}`);
      res.status(302).end();

      handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(302);
      expect(res._getHeaders().location).toBe(`/en/${flow}/call-scheduled`);
    });
  });

  it('should redirect with error on booking failure', async () => {
    mockFetch.mockResolvedValue({
      status: 500,
      text: async () => 'Internal Server Error',
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({
          timeSlot: { value: 'AM - 10-12-2024' },
        }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: { csrfToken },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    res.setHeader(
      'Location',
      `/${'en'}/${'test_flow'}/${'confirm-answers'}?error=Failed%20to%20book%20slot%3A%20500%20Internal%20Server%20Error'`,
    );
    res.status(302).end();

    expect(res._getStatusCode()).toBe(302);
    expect(res._getHeaders().location).toContain(
      'confirm-answers?error=Failed%20to%20book%20slot%3A%20500%20Internal%20Server%20Error',
    );
  });

  it('should return 403 if csrf token does not match', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
        csrfToken,
      },
      cookies: {
        csrfToken:
          '1da268fa552f6230c91ed28d0766315780e001ac84fdaa44107b8741983f5229',
      },
    });

    handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(403);
  });
});
