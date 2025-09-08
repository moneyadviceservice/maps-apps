export const setCanonicalUrl = (path: string) => {
  return (
    {
      '/en/baby-cost-calculator':
        'https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/baby-costs-calculator',
      '/cy/baby-cost-calculator':
        'https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/baby-costs-calculator',
    }[path] ?? ''
  );
};
