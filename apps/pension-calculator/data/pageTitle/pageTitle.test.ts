import type { Translate } from 'types/translation';

import { pensionCalculatorPageTitle } from './pageTitle';

describe('pensionCalculatorPageTitle', () => {
  const z = (({ en }: { en: string; cy: string }) => en) as Translate;

  it('formats the default title', () => {
    expect(pensionCalculatorPageTitle('Your income', z)).toBe(
      'Your income - Pension calculator',
    );
  });

  it('prefixes Error: when the page has errors', () => {
    expect(pensionCalculatorPageTitle('Your income', z, true)).toBe(
      'Error: Your income - Pension calculator',
    );
  });
});
