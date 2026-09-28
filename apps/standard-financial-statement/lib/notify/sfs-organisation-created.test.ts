import { NotifyClient } from 'notifications-node-client';

import { sfsSignUp } from './sfs-organisation-created';

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn(),
    })),
  };
});

describe('sfsSignUp', () => {
  const mockSendEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SFS_NOTIFY_API_KEY = 'fake-api-key';
    process.env.NOTIFY_SFS_APPLICATION_USER = 'template-id-123';
    process.env.NOTIFY_SFS_APPLICATION_ADMIN = 'template-id-456';
    process.env.NOTIFY_ADMIN_EMAIL = 'test@test.com';
    process.env.APP_ROOT = 'http://admin.example.com/';
    process.env.NOTIFY_SFS_REPLY_TO = 'reply-to-id-123';

    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));
  });

  it('sends email successfully and returns success for new user', async () => {
    mockSendEmail.mockResolvedValueOnce('OK');

    const result = await sfsSignUp(
      'John',
      'demo@test.com',
      'Org Name',
      'org-id-123',
    );

    expect(mockSendEmail).toHaveBeenCalled();

    expect(result).toBe('success');
  });

  it('sends email successfully and returns success for existing org', async () => {
    mockSendEmail.mockResolvedValueOnce('OK');

    const result = await sfsSignUp(
      'test',
      'demo@test2.com',
      'Org Name',
      'org-id-1234',
    );

    expect(mockSendEmail).toHaveBeenCalled();

    expect(result).toBe('success');
  });

  it('returns error if sfsSignUp throws', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Error'));

    const result = await sfsSignUp(
      'Demo',
      'demo@gmail.com',
      'Organisation Name',
      'org-id-12345',
    );

    expect(result).toEqual(new Error('signup email not sent'));
  });

  it('returns error env variables dont exist', async () => {
    delete process.env.NOTIFY_SFS_APPLICATION_USER;
    delete process.env.NOTIFY_SFS_APPLICATION_ADMIN;
    delete process.env.SFS_NOTIFY_API_KEY;

    const result = await sfsSignUp('John', 'demo@demo.com', 'Org', '1234');
    expect(result).toEqual(
      new Error(
        'Missing env variables (notifyApiKey, templateIdUser, templateIdAdmin) - unable to send email.',
      ),
    );
  });
});
