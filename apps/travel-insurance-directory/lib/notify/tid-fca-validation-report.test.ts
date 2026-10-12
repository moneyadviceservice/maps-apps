import { NotifyClient } from 'notifications-node-client';

import { tidFcaValidationReport } from './tid-fca-validation-report';

jest.mock('notifications-node-client');

describe('tidFcaValidationReport', () => {
  const mockApiKey = 'test-api-key';
  const mockTemplateId = 'test-template-id';
  const mockAdminEmail = 'admin@test.com';

  const mockSummary = [
    {
      name: 'Test Firm',
      frn: 123456,
      issue: '1 missing IRN number(s) | Invalid IRNs: 999999',
    },
  ];

  const MockedNotifyClient = NotifyClient;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NOTIFY_API_KEY = mockApiKey;
    process.env.NOTIFY_TEMPLATE_FCA_VALIDATION_REPORT = mockTemplateId;
    process.env.NOTIFY_ADMIN_EMAIL = mockAdminEmail;

    jest.spyOn(console, 'warn').mockImplementation(() => {
      /** No empty */
    });
    jest.spyOn(console, 'info').mockImplementation(() => {
      /** No empty */
    });
  });

  afterEach(() => {
    delete process.env.NOTIFY_API_KEY;
    delete process.env.NOTIFY_TEMPLATE_FCA_VALIDATION_REPORT;
    delete process.env.NOTIFY_ADMIN_EMAIL;
  });

  it('returns an Error if environment variables are missing', async () => {
    delete process.env.NOTIFY_API_KEY;

    const result = await tidFcaValidationReport(mockSummary);

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toContain('Missing env variables');
    }
    expect(NotifyClient).not.toHaveBeenCalled();
  });

  it('sends the validation report successfully and returns "success"', async () => {
    const sendEmailMock = jest.fn().mockResolvedValue({ data: {} });
    MockedNotifyClient.prototype.sendEmail = sendEmailMock;

    const result = await tidFcaValidationReport(mockSummary);

    expect(result).toBe('success');
    expect(MockedNotifyClient).toHaveBeenCalledWith(mockApiKey);
    expect(sendEmailMock).toHaveBeenCalledWith(mockTemplateId, mockAdminEmail, {
      personalisation: {
        emailContent: expect.stringContaining('Firm: Test Firm (FRN: 123456)'),
      },
    });

    // Verify specific issue formatting in the content
    const lastCall = sendEmailMock.mock.calls[0][2];
    expect(lastCall.personalisation.emailContent).toContain(
      'Issue: 1 missing IRN number(s) | Invalid IRNs: 999999',
    );
  });

  it('returns a "signup email not sent" error if the client fails', async () => {
    const sendEmailMock = jest
      .fn()
      .mockRejectedValue(new Error('Notify API Failure'));
    MockedNotifyClient.prototype.sendEmail = sendEmailMock;

    const result = await tidFcaValidationReport(mockSummary);

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe('signup email not sent');
    }

    expect(console.warn).toHaveBeenCalledWith(
      'There was an issue sending the email',
      expect.any(Error),
    );
  });
});
