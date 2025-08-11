import tabs from '../data/budget-planner';
import { Props } from '../pages/[language]';

export function sumFields(
  tab: (typeof tabs)[number] | undefined,
  data: Props['data'],
) {
  const tabName = tab?.name ?? '';
  return tab?.fields?.reduce((carry, { name, defaultFactorValue }) => {
    if (
      Object.keys(data).length === 0 ||
      !tabName ||
      !data[tabName as keyof typeof data]
    )
      return carry;

    const value = parseFloat(data[tabName as keyof typeof data][name]);
    const factor =
      parseFloat(data[tabName as keyof typeof data][`${name}-factor`]) ||
      defaultFactorValue;

    return data[tabName as keyof typeof data][name] && tab?.function
      ? tab.function(value * factor, carry)
      : carry;
  }, 0);
}
