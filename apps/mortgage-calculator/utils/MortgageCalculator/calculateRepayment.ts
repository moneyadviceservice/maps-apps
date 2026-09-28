import calculateDebt from './calculateDebt';
import calculateMonthlyRate from './calculateMonthlyRate';
import calculatePeriodInMonths from './calculatePeriodInMonths';

const monthlyPayment = (debt: number, nper: number, rate: number) => {
  return rate === 0
    ? debt / nper
    : (rate / (Math.pow(1 + rate, nper) - 1)) *
        (debt * Math.pow(1 + rate, nper));
};

const interest = (presentValue: number, rate: number) => {
  return rate * presentValue;
};

const remainingBalanceBreakdown = (
  monthlyPayment: number,
  debt: number,
  period: number,
  rate: number,
) => {
  const monthlyBreakdown: Array<{ presentValue: number }> = [];
  Array.from({ length: period }, (_, i) => i + 1).forEach((t, index) => {
    const presentValue = monthlyBreakdown[index - 1]?.presentValue || debt;

    const interestAccrued = interest(presentValue, rate);

    const paymentPerMonth = monthlyPayment - interestAccrued;

    monthlyBreakdown.push({
      presentValue:
        presentValue - paymentPerMonth > 0 ? presentValue - paymentPerMonth : 0,
    });
  });

  const yearlyBreakdown = [];
  yearlyBreakdown.push({ year: 0, presentValue: debt });
  monthlyBreakdown.forEach((item, index) => {
    if ((index + 1) % 12 === 0) {
      yearlyBreakdown.push({
        year: (index + 1) / 12,
        presentValue: Math.round(item.presentValue * 100) / 100,
      });
    }
  });
  return yearlyBreakdown;
};

export const calculateRepayment = (
  price: number,
  deposit: number,
  termsYear: number,
  termsMonth: number,
  rate: number,
) => {
  const remainingDebt = calculateDebt(price, deposit);
  const adjustedRate = calculateMonthlyRate(rate);
  const period = calculatePeriodInMonths(termsYear, termsMonth);

  const payment = monthlyPayment(remainingDebt, period, adjustedRate);
  const totalAmount = payment * 12 * termsYear + payment * termsMonth;

  return {
    debt: remainingDebt,
    monthlyPayment: payment,
    changedPayment: monthlyPayment(
      remainingDebt,
      period,
      calculateMonthlyRate(rate + 3),
    ),
    totalAmount,
    capitalSplit: remainingDebt,
    interestSplit: totalAmount - remainingDebt,
    balanceBreakdown: remainingBalanceBreakdown(
      payment,
      remainingDebt,
      period,
      adjustedRate,
    ),
  };
};
