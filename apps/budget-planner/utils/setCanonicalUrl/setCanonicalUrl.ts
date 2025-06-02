export const setCanonicalUrl = (path: string) => {
  return (
    {
      '/en/budget-planner':
        'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
      '/cy/budget-planner':
        'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
    }[path] ?? ''
  );
};
