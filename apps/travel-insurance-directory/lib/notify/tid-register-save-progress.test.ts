import { NotifyClient } from 'notifications-node-client';

import { tidSaveProgress } from './tid-register-save-progress';

jest.mock('notifications-node-client');

describe('tidSaveProgress', () => {
  const mockApiKey = 'test-api-key';
  const mockTemplateId = 'test-template-id';
  const email = 'test@example.com';
  const link = 'https://example.com/save';
  const name = 'Joe';

  const MockedNotifyClient = NotifyClient;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NOTIFY_API_KEY = mockApiKey;
    process.env.NOTIFY_TEMPLATE_REGISTER_SAVE = mockTemplateId;

    jest.spyOn(console, 'warn').mockImplementation(() => {
      /** No empty */
    });
  });

  afterEach(() => {
    delete process.env.NOTIFY_API_KEY;
    delete process.env.NOTIFY_TEMPLATE_REGISTER_SAVE;
  });

  it('returns an Error if environment variables are missing', async () => {
    delete process.env.NOTIFY_API_KEY;

    const result = await tidSaveProgress(email, link, name);

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toContain('Missing variables');
    }
    expect(NotifyClient).not.toHaveBeenCalled();
  });

  it('sends an email successfully and returns "success"', async () => {
    const sendEmailMock = jest.fn().mockResolvedValue({ data: {} });
    MockedNotifyClient.prototype.sendEmail = sendEmailMock;

    const result = await tidSaveProgress(email, link, name);

    expect(result).toBe('success');
    expect(MockedNotifyClient).toHaveBeenCalledWith(mockApiKey);
    expect(sendEmailMock).toHaveBeenCalledWith(mockTemplateId, email, {
      personalisation: {
        first_name: name,
        saved_progress_link: `[${link}](${link})`,
      },
    });
  });

  it('throws a "Save progress email not sent" error if the client fails', async () => {
    const sendEmailMock = jest
      .fn()
      .mockRejectedValue(new Error('Network error'));
    MockedNotifyClient.prototype.sendEmail = sendEmailMock;

    await expect(tidSaveProgress(email, link, name)).rejects.toThrow(
      'Save progress email not sent',
    );

    expect(console.warn).toHaveBeenCalledWith(
      'An issue occurred while sending the email:',
      expect.any(Error),
    );
  });
});
