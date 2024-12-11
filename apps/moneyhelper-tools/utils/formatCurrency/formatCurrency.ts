export const formatCurrency = (
  amount: number | string,
  fractionDigits?: number,
) => {
  const nAmount = Number(amount);

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let formattedAmount = formatter.format(Math.abs(nAmount));

  if (nAmount < 0) {
    formattedAmount = `£-${formattedAmount.slice(1)}`;
  }

  if (fractionDigits === 0) {
    formattedAmount = formattedAmount.replace(/\.00$/, '');
  }

  return formattedAmount;
};
