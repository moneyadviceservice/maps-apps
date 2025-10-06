export const setCanonicalUrl = (path: string) => {
  return (
    {
      '/en':
        'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
      '/cy':
        'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
    }[path] ?? ''
  );
};
