import {
  calculateOutcomeRange,
  calculateSummary,
  sumFields,
} from './calculations';

describe('Summary total calculations', () => {
  const generatemockData = (
    netPay: string,
    statePay: string,
    netFreq?: string,
    stateFrq?: string,
  ) => ({
    netPay: netPay,
    netPayFrequency: netFreq,
    statePay: statePay,
    statePayFrequency: stateFrq,
  });

  it.each`
    description                                                                                | data                                                  | results
    ${'should calculate monthly sum of two fields with default frequency prop'}                | ${generatemockData('200', '30')}                      | ${230}
    ${`should calculate monthly sum of two fields with one frequency day `}                    | ${generatemockData('20', '30', 'day')}                | ${638.33}
    ${`should calculate monthly sum of two fields with frequency four weeks`}                  | ${generatemockData('250', '90', 'fourweeks', 'day')}  | ${3009.08}
    ${`should calculate monthly sum of two fields with frequency month`}                       | ${generatemockData('250', '90', 'month', 'day')}      | ${2987.5}
    ${`should calculate monthly sum of two fields with frequency quarter`}                     | ${generatemockData('250', '90', 'quarter')}           | ${173.33}
    ${`should calculate monthly sum of two fields with frequency week`}                        | ${generatemockData('600', '400', 'week')}             | ${3007.14}
    ${`should calculate monthly sum of two fields with frequency two weeks`}                   | ${generatemockData('600', '40', 'twoweeks', 'day')}   | ${2520.24}
    ${`should calculate monthly sum of two fields with frequency 6 months`}                    | ${generatemockData('600', '40', 'sixmonths', 'week')} | ${273.81}
    ${`should calculate monthly sum of two fields with frequency 6 months`}                    | ${generatemockData('6000', '40', 'year', 'week')}     | ${673.81}
    ${`should calculate monthly sum of two fields when money input is a formatted big number`} | ${generatemockData('156,900', '40', 'year', 'week')}  | ${13248.81}
    ${`should return number with only valid data`}                                             | ${generatemockData('120', '', 'year', 'monthly')}     | ${10}
  `('$description', ({ data, results }) => {
    const sum = sumFields(data);
    expect(Number(sum.toFixed(2))).toBe(results);
  });

  it.each`
    description                                        | data                              | result
    ${'should return negative'}                        | ${{ income: 200, spending: 300 }} | ${'negative'}
    ${'should return positive'}                        | ${{ income: 800, spending: 300 }} | ${'positive'}
    ${'should return balanced when maxtotal is 0'}     | ${{ income: 100, spending: 95 }}  | ${'balanced'}
    ${'should return balanced when total is positive'} | ${{ income: 100, spending: 99 }}  | ${'balanced'}
  `('$description', ({ data, result }) => {
    const range = calculateOutcomeRange(data);

    expect(range).toBe(result);
  });

  it.each`
    description                                             | data                             | result
    ${'should return substraction of spending from income'} | ${{ income: 100, spending: 50 }} | ${50}
    ${'should return 0 if data is null'}                    | ${{}}                            | ${0}
  `('$description', ({ data, result }) => {
    expect(calculateSummary(data)).toBe(result);
  });
});
