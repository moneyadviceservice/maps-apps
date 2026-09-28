import { NextApiRequest, NextApiResponse } from 'next';

import { mockedDBData } from '../../lib/mocks';
import { databaseClient } from '../../lib/util/databaseClient';
import handler from './start-task';

const URN = 'PAR5-7TRS';
const DATA =
  'version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1&t12=4&task=12&complete=true&urn=PAR5-7TRS';

jest.mock('../../lib/util/databaseClient', () => ({
  databaseClient: jest.fn().mockResolvedValue({
    searchById: jest.fn().mockResolvedValue({}),
    updateItemInDatabase: jest.fn().mockResolvedValue({}),
    insertItemToDatabase: jest.fn().mockResolvedValue({}),
  }),
}));

jest.mock('../../utils/generateRandomReference', () => ({
  generateRandomReference: jest.fn().mockReturnValue(URN),
}));

const mockedRequest = (task: number, ref?: string) => {
  return {
    body: { language: 'en', task: task, status: 4 },
    headers: {
      referer:
        ref ??
        'http://localhost:3000/en/pensionwise-appointment/summary?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1&t12=4&task=12&complete=true',
      host: 'localhost:3000',
    },
  };
};

describe('start-task', () => {
  let response: NextApiResponse;
  beforeEach(() => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      PWD_DB_NAME: mockedDBData,
      PWD_DB_ID: mockedDBData,
      appUrl: 'pensionwise-appointment',
      appVersion: '1',
    };

    response = {
      redirect: jest.fn(),
    } as unknown as NextApiResponse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const PATH = '/en/pensionwise-appointment/';
  it.each`
    steps    | task                        | expected
    ${'t1'}  | ${'/pension-basics'}        | ${`${PATH}pension-basics?version=1&t1=4&t1q1=0&t1q2=2&task=1`}
    ${'t2'}  | ${'/income-savings'}        | ${`${PATH}income-savings?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&task=2`}
    ${'t3'}  | ${'/ debt-repayment'}       | ${`${PATH}debt-repayment?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&task=3`}
    ${'t4'}  | ${'/your-home'}             | ${`${PATH}your-home?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&task=4`}
    ${'t5'}  | ${'/health-family'}         | ${`${PATH}health-family?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&task=5`}
    ${'t6'}  | ${'/retire-later-or-delay'} | ${`${PATH}retire-later-or-delay?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&task=6`}
    ${'t7'}  | ${'/guaranteed-income'}     | ${`${PATH}guaranteed-income?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&t7=4&t7q1=0&t7q2=2&task=7`}
    ${'t8'}  | ${'/flexible-income'}       | ${`${PATH}flexible-income?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&t7=4&t7q1=0&t7q2=2&t8=4&t8q1=0&t8q2=2&task=8`}
    ${'t9'}  | ${'/lump-sums'}             | ${`${PATH}lump-sums?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&t7=4&t7q1=0&t7q2=2&t8=4&t8q1=0&t8q2=2&t9=4&t9q1=0&t9q2=2&task=9`}
    ${'t10'} | ${'/take-pot-in-one'}       | ${`${PATH}take-pot-in-one?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&t7=4&t7q1=0&t7q2=2&t8=4&t8q1=0&t8q2=2&t9=4&t9q1=0&t9q2=2&t10=4&t10q1=0&t10q2=2&task=10`}
    ${'t11'} | ${'/mix-options'}           | ${`${PATH}mix-options?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&t7=4&t7q1=0&t7q2=2&t8=4&t8q1=0&t8q2=2&t9=4&t9q1=0&t9q2=2&t10=4&t10q1=0&t10q2=2&t11=4&t11q1=0&t11q2=2&task=11`}
    ${'t12'} | ${'/summary'}               | ${`${PATH}summary?version=1&t1=4&t1q1=0&t1q2=2&t2=4&t2q1=0&t2q2=2&t3=4&t3q1=0&t3q2=2&t4=4&t4q1=0&t4q2=2&t5=4&t5q1=0&t5q2=2&t6=4&t6q1=0&t6q2=2&t7=4&t7q1=0&t7q2=2&t8=4&t8q1=0&t8q2=2&t9=4&t9q1=0&t9q2=2&t10=4&t10q1=0&t10q2=2&t11=4&t11q1=0&t11q2=2&t12=4&task=12&complete=true&urn=PAR5-7TRS`}
  `(`should redirect to the $task`, async ({ steps, task, expected }) => {
    const step = String(steps).split('t')[1];
    const params = new URLSearchParams();
    const host = 'http://localhost:3000';

    for (let i = 1; i <= Number(step); i++) {
      params.set(`t${i}`, '4');
      if (i !== 12) {
        params.set(`t${i}q1`, '0');
        params.set(`t${i}q2`, '2');
      }
    }

    (databaseClient as jest.Mock).mockResolvedValue({
      insertItemToDatabase: jest
        .fn()
        .mockResolvedValue({ urn: URN, data: DATA }),
    });

    const request = mockedRequest(
      Number(step),
      `${host}/en/pension-wise-appointment/${task}?version=1&${params.toString()}`,
    ) as NextApiRequest;

    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(302, expected);
  });

  it('should update the data in the database', async () => {
    const request = mockedRequest(12) as NextApiRequest;
    await handler(request, response);
    (databaseClient as jest.Mock).mockResolvedValue({
      searchById: jest.fn().mockResolvedValue({ urn: URN, data: DATA }),
      insertItemToDatabase: jest
        .fn()
        .mockResolvedValue({ urn: URN, data: DATA }),
    });

    expect(response.redirect).toHaveBeenCalledWith(
      302,
      `/en/pensionwise-appointment/summary?${DATA}`,
    );
  });

  it('should handle error saving to database', async () => {
    const request = mockedRequest(12) as NextApiRequest;

    (databaseClient as jest.Mock).mockResolvedValue({
      searchById: jest.fn().mockRejectedValue(new Error('Error')),
      insertItemToDatabase: jest.fn().mockRejectedValue(new Error('Error')),
    });
    await handler(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      302,
      `/en/pensionwise-appointment/summary?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1&t12=4&task=12&complete=true`,
    );
  });
});
