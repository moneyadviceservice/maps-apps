import { NotifyClient } from 'notifications-node-client';

import { tidRegisterSuccess } from './tid-register-success';

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn(),
    })),
  };
});

describe('tidRegisterSuccess', () => {
  const mockSendEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NOTIFY_API_KEY = 'fake-api-key';
    process.env.NOTIFY_TEMPLATE_REGISTER_SUCCESS = 'template-id-123';
    process.env.BASE_URL = 'http://admin.example.com/';
    process.env.NOTIFY_REPLY_TO = 'reply-to-id-123';

    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));
  });

  it('sends email successfully and returns success for new user', async () => {
    mockSendEmail.mockResolvedValueOnce('OK');

    const result = await tidRegisterSuccess('John', 'demo@test.com');

    expect(mockSendEmail).toHaveBeenCalled();

    expect(result).toBe('success');
  });

  it('returns error if tidRegisterSuccess throws', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Error'));

    const result = await tidRegisterSuccess('Demo', 'demo@gmail.com');

    expect(result).toEqual(new Error('signup email not sent'));
  });

  it('returns error env variables dont exist', async () => {
    delete process.env.NOTIFY_TEMPLATE_REGISTER_SUCCESS;
    delete process.env.NOTIFY_API_KEY;

    const result = await tidRegisterSuccess('John', 'demo@demo.com');
    expect(result).toEqual(
      new Error(
        'Missing env variables (notifyApiKey, templateIdRegisterSuccess, baseUrl) - unable to send email.',
      ),
    );
  });
});
