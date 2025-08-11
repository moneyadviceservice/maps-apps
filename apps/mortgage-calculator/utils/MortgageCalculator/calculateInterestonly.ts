import calculateDebt from './calculateDebt';
import calculateMonthlyRate from './calculateMonthlyRate';
import calculatePeriodInMonths from './calculatePeriodInMonths';

const monthlyPayment = (debt: number, rate: number) => {
  return debt * rate;
};

export const calculateInterestonly = (
  price: number,
  deposit: number,
  termsYear: number,
  termsMonth: number,
  rate: number,
) => {
  const remainingDebt = calculateDebt(price, deposit);
  const monthlyRate = calculateMonthlyRate(rate);
  const payment = monthlyPayment(remainingDebt, monthlyRate);
  const totalAmount =
    calculatePeriodInMonths(termsYear, termsMonth) * payment + remainingDebt;

  return {
    debt: remainingDebt,
    monthlyPayment: payment,
    changedPayment: monthlyPayment(
      remainingDebt,
      calculateMonthlyRate(rate + 3),
    ),
    totalAmount,
    capitalSplit: price - deposit,
    interestSplit: totalAmount - remainingDebt,
    balanceBreakdown: Array.from(
      { length: termsYear + Math.ceil(termsMonth / 12) },
      (_, i) => i + 1,
    ).map((item) => {
      return { year: item, presentValue: remainingDebt };
    }),
  };
};
