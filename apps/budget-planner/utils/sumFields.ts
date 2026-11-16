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

    const dataValue = data[tabName as keyof typeof data][name];
    // handle commas in the data. If dataValue is undefined, ignore it and just use 0 to make it neutral
    const value = dataValue
      ? Number.parseFloat(dataValue.replace(/[£,]/g, '').trim())
      : 0;
    const factor =
      Number.parseFloat(data[tabName as keyof typeof data][`${name}-factor`]) ||
      defaultFactorValue;

    return data[tabName as keyof typeof data][name] && tab?.function
      ? tab.function(value * factor, carry)
      : carry;
  }, 0);
}
