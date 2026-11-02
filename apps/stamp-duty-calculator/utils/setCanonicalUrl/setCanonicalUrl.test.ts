import { setCanonicalUrl } from './setCanonicalUrl';

describe('setCanonicalUrl', () => {
  it.each`
    description                                                           | path             | expected
    ${'Stamp Duty Calculator (English)'}                                  | ${'/en/sdlt'}    | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator'}
    ${'Stamp Duty Calculator (Welsh)'}                                    | ${'/cy/sdlt'}    | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator'}
    ${'Land Transaction Tax Calculator Wales (English)'}                  | ${'/en/ltt'}     | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales'}
    ${'Land Transaction Tax Calculator Wales (Welsh)'}                    | ${'/cy/ltt'}     | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales'}
    ${'Land and Buildings Transaction Tax Calculator Scotland (English)'} | ${'/en/lbtt'}    | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland'}
    ${'Land and Buildings Transaction Tax Calculator Scotland (Welsh)'}   | ${'/cy/lbtt'}    | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland'}
    ${'Unknown Path (English)'}                                           | ${'/en/unknown'} | ${''}
    ${'Unknown Path (Welsh)'}                                             | ${'/cy/unknown'} | ${''}
    ${'Empty Path'}                                                       | ${''}            | ${''}
  `('$description', ({ path, expected }) => {
    expect(setCanonicalUrl(path)).toBe(expected);
  });
});
