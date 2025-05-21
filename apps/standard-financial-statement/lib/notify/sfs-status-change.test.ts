import { NotifyClient } from 'notifications-node-client';

import { sfsStatusChange } from './sfs-status-change';

jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => ({
      sendEmail: jest.fn(),
    })),
  };
});

describe('sfsStatusChange', () => {
  const mockSendEmail = jest.fn();

  const mockEnv = {
    MH_NOTIFY_API_KEY: 'fake-api-key',
    NOTIFY_SFS_STATUS_CHANGE: 'template-id-123',
  };

  const email = 'test@example.com';
  const organisation_name = 'Test Org';
  const emailContent = 'Welcome!';
  const additionalEmailContent = 'Please read the attached info.';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MH_NOTIFY_API_KEY = mockEnv.MH_NOTIFY_API_KEY;
    process.env.NOTIFY_SFS_STATUS_CHANGE = mockEnv.NOTIFY_SFS_STATUS_CHANGE;

    (NotifyClient as jest.Mock).mockImplementation(() => ({
      sendEmail: mockSendEmail,
    }));
  });

  it('sends email successfully and returns success', async () => {
    mockSendEmail.mockResolvedValueOnce('OK');

    const result = await sfsStatusChange(
      email,
      organisation_name,
      emailContent,
      additionalEmailContent,
    );

    expect(mockSendEmail).toHaveBeenCalledWith('template-id-123', email, {
      personalisation: {
        organisation_name,
        emailContent,
        additionalEmailContent,
      },
    });

    expect(result).toBe('success');
  });

  it('returns error if sendEmail throws', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Notify API failed'));

    const result = await sfsStatusChange(email, organisation_name);

    expect(result).toEqual(new Error('Status change email not sent'));
  });

  it('returns error if env vars are missing', async () => {
    delete process.env.MH_NOTIFY_API_KEY;
    delete process.env.NOTIFY_SFS_STATUS_CHANGE;

    const result = await sfsStatusChange(email, organisation_name);
    expect(result).toEqual(
      new Error('Missing env variables - unable to send email.'),
    );
  });
});
