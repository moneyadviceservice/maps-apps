import { evUrl } from 'lib/api/ev/evUrl';
import { getAccessToken } from 'lib/api/ev/getAccessToken';

const INCOME_PATH = '/state-benefit/1.0.0/stateBenefitAge/income';
const ANNUAL_AMOUNT_THRESHOLD = 1000;

const weeklyAmountFromIncome = (body: unknown): string | null => {
  if (!body || typeof body !== 'object' || !('income' in body)) {
    return null;
  }

  const { income } = body as { income: unknown };
  if (typeof income !== 'number' || !Number.isFinite(income)) {
    return null;
  }

  const weekly = income > ANNUAL_AMOUNT_THRESHOLD ? income / 52 : income;

  return weekly.toFixed(2);
};

/** Fetches the current maximum from EV */
export const getMaxWeeklyAmount = async (): Promise<string> => {
  const token = await getAccessToken();
  const response = await fetch(evUrl(INCOME_PATH), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('State benefit request failed');
  }

  const weeklyAmount = weeklyAmountFromIncome(await response.json());
  if (!weeklyAmount) {
    throw new Error('State benefit income response did not include an amount');
  }

  return weeklyAmount;
};
