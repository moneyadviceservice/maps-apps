import { NotifyClient } from 'notifications-node-client';

import { tidReregistration } from './tid-reregistration';

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn(),
    })),
  };
});

describe('tidReregistration', () => {
  const mockSendEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NOTIFY_API_KEY = 'fake-api-key';
    process.env.NOTIFY_TEMPLATE_REREGISTRATION =
      '4e2f3ee2-29e2-49d6-89f8-5bc498331560';
    process.env.BASE_URL = 'http://admin.example.com';

    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));
  });

  afterEach(() => {
    delete process.env.NOTIFY_API_KEY;
    delete process.env.NOTIFY_TEMPLATE_REREGISTRATION;
    delete process.env.BASE_URL;
  });

  it('sends email with first_name and self-serve landing URL', async () => {
    mockSendEmail.mockResolvedValueOnce('OK');

    const result = await tidReregistration('Jane', 'jane@example.com');

    expect(result).toBe('success');
    expect(NotifyClient).toHaveBeenCalledWith('fake-api-key');
    expect(mockSendEmail).toHaveBeenCalledWith(
      '4e2f3ee2-29e2-49d6-89f8-5bc498331560',
      'jane@example.com',
      {
        personalisation: {
          first_name: 'Jane',
          self_serve_url: 'http://admin.example.com/account',
        },
      },
    );
  });

  it('strips a trailing slash from BASE_URL before appending /account', async () => {
    process.env.BASE_URL = 'http://admin.example.com/';
    mockSendEmail.mockResolvedValueOnce('OK');

    await tidReregistration('Jane', 'jane@example.com');

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.any(String),
      'jane@example.com',
      {
        personalisation: {
          first_name: 'Jane',
          self_serve_url: 'http://admin.example.com/account',
        },
      },
    );
  });

  it('returns error if sendEmail throws', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Error'));

    const result = await tidReregistration('Jane', 'jane@example.com');

    expect(result).toEqual(new Error('re-registration email not sent'));
  });

  it('returns error when env variables are missing', async () => {
    delete process.env.NOTIFY_TEMPLATE_REREGISTRATION;
    delete process.env.NOTIFY_API_KEY;
    delete process.env.BASE_URL;

    const result = await tidReregistration('Jane', 'jane@example.com');

    expect(result).toEqual(
      new Error(
        'Missing env variables (notifyApiKey, templateIdReregistration, baseUrl) - unable to send email.',
      ),
    );
    expect(NotifyClient).not.toHaveBeenCalled();
  });
});
