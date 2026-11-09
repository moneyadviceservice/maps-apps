export const setCanonicalUrl = (path: string) => {
  return (
    {
      '/en/sdlt':
        'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
      '/cy/sdlt':
        'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator',
      '/en/ltt':
        'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales',
      '/cy/ltt':
        'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales',
      '/en/lbtt':
        'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
      '/cy/lbtt':
        'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
    }[path] ?? ''
  );
};
