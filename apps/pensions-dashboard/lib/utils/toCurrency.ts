export const currencyAmount = (amount: number) => {
  return amount?.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
  });
};
