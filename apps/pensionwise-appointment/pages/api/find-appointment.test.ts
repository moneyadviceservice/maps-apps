import { NextApiRequest, NextApiResponse } from 'next';

import { mockedDBData } from '../../lib/mocks';
import { databaseClient } from '../../lib/util/databaseClient';
import handler from './find-appointment';

jest.mock('../../lib/util/databaseClient', () => ({
  databaseClient: jest.fn().mockResolvedValue({
    searchById: jest.fn().mockResolvedValue({}),
  }),
}));

const HOST = '/en/pension-wise-appointment';
const URN = 'PAR5-7TRS';
const DATA =
  'version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1&t12=4&task=12&complete=true';

const mockRequest = (
  urn: string,
  language: string,
  referer: string,
  hasError = false,
) =>
  ({
    body: {
      urn: urn,
      language: language,
    },
    headers: {
      referer: !hasError ? `${referer}` : `${referer}?error=urn`,
    },
  } as unknown as NextApiRequest);

describe('find-appointment', () => {
  let request: NextApiRequest;
  let response: NextApiResponse;
  beforeEach(() => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      PWD_DB_NAME: mockedDBData,
      PWD_DB_ID: mockedDBData,
      appUrl: 'pension-wise-appointment',
      appVersion: '1',
    };

    request = mockRequest(
      URN,
      'en',
      'http://localhost:3000/en/pension-wise-appointment/find-appointment',
    );

    response = {
      redirect: jest.fn(),
    } as unknown as NextApiResponse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to client-summary page when urn is found in database', async () => {
    const dataToJson = DATA.split('&').reduce(
      (acc: Record<string, string>, curr) => {
        const param = curr.split('=');
        const key = param[0];
        const value = param[1];

        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    (databaseClient as jest.Mock).mockResolvedValue({
      searchById: jest.fn().mockResolvedValue({ urn: URN, data: dataToJson }),
    });

    await handler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      302,
      `${HOST}/client-summary?${DATA}&urn=${URN}`,
    );
  });

  it('should redirect to find-appointment page with error when urn is not found in database', async () => {
    const request = mockRequest(
      '',
      'en',
      'http://localhost:3000/en/pension-wise-appointment/find-appointment',
      true,
    );
    (databaseClient as jest.Mock).mockResolvedValue({
      searchById: jest.fn().mockRejectedValue(new Error('ID must be defined')),
    });

    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      302,
      `${HOST}/find-appointment?error=urn`,
    );
  });

  it('should redirect to find-appointment page with error when data are not saved', async () => {
    (databaseClient as jest.Mock).mockResolvedValue({
      searchById: jest.fn().mockResolvedValue({ urn: URN, data: null }),
    });
    const request = mockRequest(
      URN,
      '',
      'http://localhost:3000/en/pension-wise-appointment/find-appointment',
      false,
    );
    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      302,
      `${HOST}/find-appointment?error=urn`,
    );
  });

  it('should redirect to find-appointment page with error when database connection fails', async () => {
    request = {
      body: {
        urn: '',
        language: 'en',
      },
      headers: {
        referer:
          'http://localhost:3000/en/pension-wise-appointment/find-appointment?error=urn',
      },
    } as unknown as NextApiRequest;

    process.env.PWD_DB_NAME = '';
    process.env.PWD_DB_ID = '';

    (databaseClient as jest.Mock).mockRejectedValue(
      new Error('Database ID and container ID must be defined'),
    );

    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      302,
      `${HOST}/find-appointment?error=access`,
    );
  });
});
