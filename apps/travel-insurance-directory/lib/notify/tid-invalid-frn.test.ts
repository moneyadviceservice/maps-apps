import { NotifyClient } from 'notifications-node-client';

import { tidInvalidFrn } from './tid-invalid-frn';

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => {
      return {
        sendEmail: jest.fn(),
      };
    }),
  };
});

describe('tidInvalidFrn', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return "success" when the email is sent successfully', async () => {
    process.env.NOTIFY_API_KEY = 'test-key';
    process.env.NOTIFY_TEMPLATE_INVALID_FRN = 'template-id';

    const mockSendEmail = jest.fn().mockResolvedValue({ data: 'ok' });
    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));

    const result = await tidInvalidFrn('John', 'john@example.com');

    expect(result).toBe('success');
    expect(mockSendEmail).toHaveBeenCalledWith(
      'template-id',
      'john@example.com',
      { personalisation: { first_name: 'John' } },
    );
  });

  it('should return an Error if environment variables are missing', async () => {
    delete process.env.NOTIFY_API_KEY;
    delete process.env.NOTIFY_TEMPLATE_INVALID_FRN;

    const result = await tidInvalidFrn('John', 'john@example.com');

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toContain('Missing env variables');
    }
  });

  it('should return an Error and log a warning if notifyClient.sendEmail fails', async () => {
    process.env.NOTIFY_API_KEY = 'test-key';
    process.env.NOTIFY_TEMPLATE_INVALID_FRN = 'template-id';

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const mockSendEmail = jest.fn().mockRejectedValue(new Error('API Failure'));
    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));

    const result = await tidInvalidFrn('John', 'john@example.com');

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe('Invalid FRN email not sent');
    }
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
