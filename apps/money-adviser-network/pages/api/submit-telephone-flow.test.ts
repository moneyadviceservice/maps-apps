import { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';

import handler from './submit-telephone-flow';

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

describe('Handler API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.BOOK_APPOINTMENT_SLOT_CODE = 'test_code';
    process.env.APPOINTMENTS_API = 'https://api.example.com/';
  });

  it('should return 400 if required env variables are missing', async () => {
    delete process.env.BOOK_APPOINTMENT_SLOT_CODE;

    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: 'Missing required parameter(s): BOOK_APPOINTMENT_SLOT_CODE',
    });
  });

  it('should return 400 if slot format is invalid', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({ 't-5': 'InvalidSlot' }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
      },
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Invalid slot format' });
  });

  it('should redirect on successful booking', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({ 't-5': 'AM - 10-12-2024' }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
      },
    });

    res.setHeader('Location', `/${'en'}/${'test_flow'}/${'call-scheduled'}`);
    res.status(302).end();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(302);
    expect(res._getHeaders().location).toBe('/en/test_flow/call-scheduled');
  });

  it('should redirect with error on booking failure', async () => {
    mockFetch.mockResolvedValue({
      status: 500,
      text: async () => 'Internal Server Error',
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        cookieData: JSON.stringify({ 't-5': 'AM - 10-12-2024' }),
        urlData: '{}',
        language: 'en',
        currentFlow: 'test_flow',
      },
    });

    await handler(
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
});
