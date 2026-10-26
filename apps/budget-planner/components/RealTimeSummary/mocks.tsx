export const defaultProps = {
  income: {
    pay: '4000',
  },
  'household-bills': { mortgage: '2200' },
};

export const negativeProps = {
  income: { pay: '4000' },
  'household-bills': { insurance: '560', mobile: '300', mortgage: '3200' },
};

export const neutralProps = {
  income: { pay: '4000' },
  'household-bills': { mobile: '1000', mortgage: '3000' },
};
