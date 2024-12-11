import { setCanonicalUrl } from './setCanonicalUrl';

describe('setCanonicalUrl', () => {
  it.each`
    description                                                           | path                                                        | expected
    ${'Land Transaction Tax Calculator Wales (English)'}                  | ${'/en/ltt-calculator'}                                     | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales'}
    ${'Land Transaction Tax Calculator Wales (Welsh)'}                    | ${'/cy/ltt-calculator'}                                     | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales'}
    ${'Land and Buildings Transaction Tax Calculator Scotland (English)'} | ${'/en/lbtt-calculator'}                                    | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland'}
    ${'Land and Buildings Transaction Tax Calculator Scotland (Welsh)'}   | ${'/cy/lbtt-calculator'}                                    | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland'}
    ${'Stamp Duty Calculator (English)'}                                  | ${'/en/sdlt-calculator'}                                    | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator'}
    ${'Stamp Duty Calculator (Welsh)'}                                    | ${'/cy/sdlt-calculator'}                                    | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator'}
    ${'Midlife MOT (English)'}                                            | ${'/en/mid-life-mot'}                                       | ${'https://www.moneyhelper.org.uk/en/everyday-money/midlife-mot'}
    ${'Midlife MOT (Welsh)'}                                              | ${'/cy/mid-life-mot'}                                       | ${'https://www.moneyhelper.org.uk/cy/everyday-money/midlife-mot'}
    ${'Mortgage Calculator (English)'}                                    | ${'/en/mortgage-calculator'}                                | ${'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator'}
    ${'Mortgage Calculator (Welsh)'}                                      | ${'/cy/mortgage-calculator'}                                | ${'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-calculator'}
    ${'Credit Refusal (English)'}                                         | ${'/en/credit-rejection'}                                   | ${'https://www.moneyhelper.org.uk/en/everyday-money/credit/when-youve-been-refused-credit'}
    ${'Credit Refusal (Welsh)'}                                           | ${'/cy/credit-rejection'}                                   | ${'https://www.moneyhelper.org.uk/cy/everyday-money/credit/when-youve-been-refused-credit'}
    ${'Bank Account Fees Comparison Tool (English)'}                      | ${'/en/use-our-compare-bank-account-fees-and-charges-tool'} | ${'https://www.moneyhelper.org.uk/en/everyday-money/banking/compare-bank-account-fees-and-charges'}
    ${'Bank Account Fees Comparison Tool (Welsh)'}                        | ${'/cy/use-our-compare-bank-account-fees-and-charges-tool'} | ${'https://www.moneyhelper.org.uk/cy/everyday-money/banking/compare-bank-account-fees-and-charges'}
    ${'Land Transaction Tax Calculator'}                                  | ${'/en/dalt-calculator'}                                    | ${''}
    ${'Land Transaction Tax Calculator'}                                  | ${'/cy/dalt-calculator'}                                    | ${''}
    ${'INBEST'}                                                           | ${'/en/inbest'}                                             | ${''}
    ${'INBEST'}                                                           | ${'/cy/inbest'}                                             | ${''}
    ${'Universal Credit'}                                                 | ${'/en/universal-credit'}                                   | ${''}
    ${'Universal Credit'}                                                 | ${'/cy/universal-credit'}                                   | ${''}
    ${'Budget Planner - Income'}                                          | ${'/en/budget-planner/income'}                              | ${''}
    ${'Budget Planner - Income'}                                          | ${'/cy/budget-planner/income'}                              | ${''}
    ${'Credit Options'}                                                   | ${'/en/credit-options'}                                     | ${''}
    ${'Credit Options'}                                                   | ${'/cy/credit-options'}                                     | ${''}
    ${'Unknown Path en'}                                                  | ${'/en/unknown'}                                            | ${undefined}
    ${'Unknown Path cy'}                                                  | ${'/cy/unknown'}                                            | ${undefined}
  `('$description', ({ path, expected }) => {
    expect(setCanonicalUrl(path)).toBe(expected);
  });
});
