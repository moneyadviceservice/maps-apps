type Summary = {
  income: number;
  spending: number;
};

type Transaction = {
  value: number;
};

type Outcome = 'positive' | 'neutral' | 'negative';

export default function calculateSummary(
  carry: Summary,
  { value }: Transaction,
) {
  const key = value > 0 ? 'income' : 'spending';
  return {
    ...carry,
    [key]: carry[key] + value,
  };
}

export const calculateOutcomeRange = (summary: Summary): Outcome => {
  const { income, spending } = summary;
  const maxtotal = income + (-(income * (5 / 100)) + spending);
  const total = income + spending;

  let result: Outcome;

  if (total < 0) {
    result = 'negative';
  } else if (maxtotal > 0) {
    result = 'positive';
  } else {
    result = 'neutral';
  }

  return result;
};
