import { getDataFromMemory, getPartnersFromRedis } from 'lib/util/cacheToRedis';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from './save-and-return';
import { ERROR_TYPES } from 'lib/constants/constants';
import {
  databaseClient,
  saveEntry,
  searchById,
} from 'lib/util/databaseConnect';

const mockPartnerData = {
  id: 1,
  dob: { day: '16', month: '11', year: '1989' },
  gender: 'female',
  retireAge: '68',
};

const mockIncome = {
  pageData: {
    formnetIncome: '6,000',
    formstateBenefits: '1,200',
    formstatePension: '600',
    formestimatedIncomeLabel: 'Pension 1',
    formestimatedIncome: '100',
    formestimatedIncomeSectionLabel1: 'Pension 2',
    formestimatedIncomeSection1: '800',
  },
  additionalFields: { estimatedIncomeSection: [1] },
};

const mockCosts = {
  pageData: {
    formmortgageRepayment: '20',
    formmortgageRepaymentFrequency: 'month',
    formrent: '30',
    formrentFrequency: 'month',
    formgroundRent: '10',
    formgroundRentFrequency: 'month',
    formserviceCharge: '20',
    formserviceChargeFrequency: 'month',
    formloans: '30',
  },
};

jest.mock('lib/util/databaseConnect', () => ({
  databaseClient: jest.fn(),
  saveEntry: jest.fn(),
  searchById: jest.fn(),
}));

jest.mock('lib/util/cacheToRedis', () => ({
  getDataFromMemory: jest.fn(),
  getPartnersFromRedis: jest.fn(),
}));

jest.mock('lib/util/databaseConnect/updateEntry', () => jest.fn());

let mockSendEmail = jest.fn();
jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => ({
    sendEmail: mockSendEmail,
  })),
}));

const mockRequest = (
  isJSon: boolean,
  email: string = 'test@test.com',
  sessionId: string | null = 'sessionid',
) =>
  ({
    body: {
      email: email,
      sessionId: sessionId,
      language: 'en',
      isJSon: isJSon,
    },
    headers: {
      referer:
        'https://domain.com/en/save?isEmbedded=false&sessionId=sessionid&tabName=income&stepsEnabled=3',
    },
  } as unknown as NextApiRequest);

describe('Save and return api', () => {
  let response: NextApiResponse;
  let request: NextApiRequest;

  beforeEach(() => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NOTIFY_API_KEY: 'notify-key',
      NOTIFY_TEMPLATE_ID_EN: 'en-template-id',
      NOTIFY_TEMPLATE_ID_CY: 'cy-template-id',
    };
    mockSendEmail = jest.fn();
    response = {
      redirect: jest.fn(),
      status: jest.fn().mockImplementation(() => ({
        json: jest.fn(),
      })),
    } as unknown as NextApiResponse;
    request = mockRequest(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should save data and send email and send 200 response', async () => {
    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('should save data and send email and redirect to progress saved page', async () => {
    request = mockRequest(false);
    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);

    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      303,
      '/en/progress-saved?isEmbedded=false&sessionId=sessionid&tabName=income&stepsEnabled=3',
    );
  });

  it('should return email validation error', async () => {
    request = mockRequest(true, 'test');
    const jsonMock = jest.fn();
    response = {
      status: jest.fn().mockReturnValue({
        json: jsonMock,
      }),
    } as unknown as NextApiResponse;
    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Email validation error',
      type: { email: ERROR_TYPES.EMAIL },
    });
  });

  it('should redirect to same page after email validation error', async () => {
    request = mockRequest(false, 'test');
    await handler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      303,
      '/en/save?isEmbedded=false&sessionId=sessionid&tabName=income&stepsEnabled=3&error=email',
    );
  });

  it('should return error if getting data from Redis fails', async () => {
    const jsonMock = jest.fn();
    response = {
      status: jest.fn().mockReturnValue({
        json: jsonMock,
      }),
    } as unknown as NextApiResponse;

    (getPartnersFromRedis as jest.Mock).mockRejectedValue({});
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      type: ERROR_TYPES.SESSION_EXPIRED,
    });
  });

  it('should redirect to error page with error query param', async () => {
    request = mockRequest(false);
    (getPartnersFromRedis as jest.Mock).mockRejectedValue({});
    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      303,
      '/en/error-page?isEmbedded=false',
    );
  });

  it('should return error when fails to connect to database', async () => {
    const jsonMock = jest.fn();
    response = {
      status: jest.fn().mockReturnValue({
        json: jsonMock,
      }),
    } as unknown as NextApiResponse;

    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);
    (databaseClient as jest.Mock).mockRejectedValue({});

    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      type: ERROR_TYPES.API_CALL_FAILED,
    });
  });

  it('should return error when fails to send the email', async () => {
    const jsonMock = jest.fn();

    response = {
      status: jest.fn().mockReturnValue({
        json: jsonMock,
      }),
    } as unknown as NextApiResponse;
    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);

    (databaseClient as jest.Mock).mockResolvedValue({});
    (saveEntry as jest.Mock).mockResolvedValue({});
    (searchById as jest.Mock).mockResolvedValue({});
    mockSendEmail = jest.fn().mockRejectedValueOnce({});
    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      type: ERROR_TYPES.NOTIFY_ERROR,
    });
  });

  it('should return error when fails to get data from database to database', async () => {
    const jsonMock = jest.fn();
    response = {
      status: jest.fn().mockReturnValue({
        json: jsonMock,
      }),
    } as unknown as NextApiResponse;

    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);
    (searchById as jest.Mock).mockResolvedValue({});
    (saveEntry as jest.Mock).mockRejectedValue({});

    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      type: ERROR_TYPES.API_CALL_FAILED,
    });
  });

  it('should redirect to error page when fail to save data to database', async () => {
    request = mockRequest(false);
    (getPartnersFromRedis as jest.Mock).mockRejectedValue({});
    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);
    (databaseClient as jest.Mock).mockRejectedValue({});
    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      303,
      '/en/error-page?isEmbedded=false',
    );
  });

  it('should redirect to error page when fails to send the email', async () => {
    request = mockRequest(false);

    (getPartnersFromRedis as jest.Mock).mockResolvedValue(mockPartnerData);
    (getDataFromMemory as jest.Mock)
      .mockResolvedValueOnce(mockIncome)
      .mockResolvedValue(mockCosts);
    mockSendEmail = jest.fn().mockRejectedValue({});
    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      303,
      '/en/error-page?isEmbedded=false',
    );
  });

  it('should return error message is sessionid is invalid', async () => {
    request = mockRequest(true, '', null);
    await handler(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });
});
