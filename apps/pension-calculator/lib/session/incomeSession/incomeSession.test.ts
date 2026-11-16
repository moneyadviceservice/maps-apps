import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import { defaultYourIncomeData } from 'types/income';

import { getIncomeFromSession, saveIncomeToSession } from './incomeSession';

jest.mock('lib/session/journeySession', () => ({
  getJourneySession: jest.fn(),
  updateJourneySession: jest.fn(),
}));

const mockedGet = getJourneySession as jest.MockedFunction<
  typeof getJourneySession
>;
const mockedUpdate = updateJourneySession as jest.MockedFunction<
  typeof updateJourneySession
>;

describe('incomeSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns parsed income data from the journey session', async () => {
    mockedGet.mockResolvedValue({
      income: {
        grossPay: '100',
        grossPayFrequency: 'month',
        otherIncome: [{ name: 'Savings', amount: '10', frequency: 'year' }],
      },
    });

    const data = await getIncomeFromSession('abc');
    expect(data?.grossPay).toBe('100');
    expect(data?.grossPayFrequency).toBe('month');
  });

  it('returns null when income is missing', async () => {
    mockedGet.mockResolvedValue({});
    expect(await getIncomeFromSession('abc')).toBeNull();
  });

  it('saves income data onto the journey session', async () => {
    mockedUpdate.mockResolvedValue({ income: defaultYourIncomeData() });
    const data = defaultYourIncomeData();
    await saveIncomeToSession('abc', data);
    expect(mockedUpdate).toHaveBeenCalledWith('abc', { income: data });
  });
});
