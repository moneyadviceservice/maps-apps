import { NotifyClient } from 'notifications-node-client';

import { handleSaveEmail } from './handleSaveEmail';

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn(),
}));

const sendEmail = jest.fn();
const getNotificationById = jest.fn();

const sendError = {
  valid: false,
  redirectPath:
    '/en/save?error=send&returnTo=%2Fen%2Fyour-income%3FsessionId%3Dabc&sessionId=abc',
};

const progressSaved = {
  valid: true,
  redirectPath:
    '/en/progress-saved?returnTo=%2Fen%2Fyour-income%3FsessionId%3Dabc&sessionId=abc',
};

describe('handleSaveEmail', () => {
  const input = {
    email: 'person@example.com',
    language: 'en',
    sessionId: 'abc',
    returnTo: '/en/your-income?sessionId=abc',
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    sendEmail.mockReset();
    getNotificationById.mockReset();
    sendEmail.mockResolvedValue({
      status: 201,
      data: { id: 'notification-1' },
    });
    getNotificationById.mockResolvedValue({
      status: 200,
      data: { status: 'sending' },
    });
    (NotifyClient as unknown as jest.Mock).mockImplementation(() => ({
      sendEmail,
      getNotificationById,
    }));
    process.env.NOTIFY_API_KEY = 'notify-key';
    process.env.NOTIFY_TEMPLATE_ID = 'template-id';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(['sending', 'delivered'])(
    'sends the return link and opens the progress saved page when Notify status is %s',
    async (status) => {
      getNotificationById.mockResolvedValue({
        status: 200,
        data: { status },
      });

      const result = await handleSaveEmail(input);

      expect(sendEmail).toHaveBeenCalledWith(
        'template-id',
        'person@example.com',
      );
      expect(getNotificationById).toHaveBeenCalledWith('notification-1');
      expect(result).toEqual(progressSaved);
      expect(result.redirectPath).not.toContain('person%40example.com');
    },
  );

  it('uses the same template for a Welsh return link', async () => {
    const result = await handleSaveEmail({
      ...input,
      language: 'cy',
      returnTo: '/cy/your-income?sessionId=abc',
    });

    expect(sendEmail).toHaveBeenCalledWith('template-id', 'person@example.com');
    expect(result.valid).toBe(true);
    expect(result.redirectPath).toContain('/cy/progress-saved');
  });

  it('reloads the save page for a badly formatted address and does not send', async () => {
    const result = await handleSaveEmail({ ...input, email: 'not-an-email' });

    expect(sendEmail).not.toHaveBeenCalled();
    expect(result.valid).toBe(false);
    expect(result.redirectPath).toContain('error=email');
    expect(result.redirectPath).not.toContain('not-an-email');
  });

  it('reloads the save page when Notify fails', async () => {
    sendEmail.mockRejectedValue(new Error('notify down'));

    const result = await handleSaveEmail(input);

    expect(result).toEqual(sendError);
  });

  it.each(['temporary-failure', 'permanent-failure', 'technical-failure'])(
    'reloads the save page when Notify status is %s',
    async (status) => {
      getNotificationById.mockResolvedValue({
        status: 200,
        data: { status },
      });

      const result = await handleSaveEmail(input);

      expect(result).toEqual(sendError);
    },
  );

  it('reloads the save page when the Notify API key is missing', async () => {
    delete process.env.NOTIFY_API_KEY;

    const result = await handleSaveEmail(input);

    expect(sendEmail).not.toHaveBeenCalled();
    expect(result).toEqual(sendError);
  });

  it('ignores a return path on another site', async () => {
    const result = await handleSaveEmail({
      ...input,
      email: 'bad',
      returnTo: 'https://example.com',
    });

    expect(result.redirectPath).toContain(
      'returnTo=%2Fen%2Fabout-you%3FsessionId%3Dabc',
    );
  });
});
