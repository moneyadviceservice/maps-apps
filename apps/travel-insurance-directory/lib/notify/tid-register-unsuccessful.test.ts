import { NotifyClient } from 'notifications-node-client';

import { tidRegisterUnsuccessful } from './tid-register-unsuccessful';

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn(),
    })),
  };
});

describe('tidRegisterUnsuccessful', () => {
  const mockSendEmail = jest.fn();

  const mockEnv = {
    NOTIFY_API_KEY: 'fake-api-key',
    NOTIFY_TEMPLATE_REGISTER_UNSECCESSFUL: 'template-id-123',
    NOTIFY_REPLY_TO: 'reply-to-id-123',
    NOTIFY_ADMIN_EMAIL: 'admin@email.com',
  };

  const firstName = 'first';
  const lastName = 'last';
  const FRN = '12345';
  const adminEmail = 'admin@email.com';
  const email = 'user@email.com';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NOTIFY_API_KEY = mockEnv.NOTIFY_API_KEY;
    process.env.NOTIFY_TEMPLATE_REGISTER_UNSECCESSFUL =
      mockEnv.NOTIFY_TEMPLATE_REGISTER_UNSECCESSFUL;
    process.env.NOTIFY_REPLY_TO = mockEnv.NOTIFY_REPLY_TO;
    process.env.NOTIFY_ADMIN_EMAIL = mockEnv.NOTIFY_ADMIN_EMAIL;

    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));
  });

  it('sends email successfully and returns success', async () => {
    mockSendEmail.mockResolvedValueOnce('OK');

    const result = await tidRegisterUnsuccessful(
      firstName,
      lastName,
      FRN,
      email,
    );

    expect(mockSendEmail).toHaveBeenCalledWith('template-id-123', adminEmail, {
      personalisation: {
        first_name: firstName,
        last_name: lastName,
        FRN,
        email,
      },
    });

    expect(result).toBe('success');
  });

  it('returns error if sendEmail throws', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Notify API failed'));

    const result = await tidRegisterUnsuccessful(
      firstName,
      lastName,
      FRN,
      email,
    );

    expect(result).toEqual(new Error('signup email not sent'));
  });

  it('returns error if env vars are missing', async () => {
    delete process.env.NOTIFY_API_KEY;
    delete process.env.NOTIFY_TEMPLATE_REGISTER_UNSECCESSFUL;
    delete process.env.NOTIFY_ADMIN_EMAIL;

    const result = await tidRegisterUnsuccessful(
      firstName,
      lastName,
      FRN,
      email,
    );
    expect(result).toEqual(
      new Error(
        'Missing env variables (notifyApiKey, templateIdRegisterUnuccessful, adminEmail) - unable to send email.',
      ),
    );
  });
});
