import { calculateMonthsWorthOfSalary } from '.';

describe('Redundancy pay calculator helper functions', () => {
  describe('calculateStatutoryRedundancyPay', () => {
    it.each`
      scenario | redundancyPay | salary                              | country | expected
      ${1}     | ${1587}       | ${{ amount: 15000, frequency: 0 }}  | ${0}    | ${'1.3'}
      ${2}     | ${5651}       | ${{ amount: 32650, frequency: 0 }}  | ${3}    | ${'2.4'}
      ${3}     | ${5250}       | ${{ amount: 798, frequency: 2 }}    | ${2}    | ${'1.8'}
      ${4}     | ${2742}       | ${{ amount: 2640, frequency: 1 }}   | ${1}    | ${'1.2'}
      ${5}     | ${1327}       | ${{ amount: 23000, frequency: 0 }}  | ${0}    | ${'0.8'}
      ${6}     | ${3150}       | ${{ amount: 91000, frequency: 0 }}  | ${0}    | ${'0.6'}
      ${7}     | ${0}          | ${{ amount: 154000, frequency: 0 }} | ${1}    | ${'0.0'}
      ${8}     | ${14000}      | ${{ amount: 78514, frequency: 0 }}  | ${0}    | ${'2.8'}
      ${9}     | ${3645}       | ${{ amount: 41500, frequency: 0 }}  | ${3}    | ${'1.2'}
      ${10}    | ${18900}      | ${{ amount: 52943, frequency: 0 }}  | ${0}    | ${'5.1'}
      ${11}    | ${0}          | ${{ amount: 154000, frequency: 0 }} | ${0}    | ${'0.0'}
    `(
      'should calculate the correct redundancy pay for Scenario #$scenario ($redundancyPay, $salary, $country)',
      ({ redundancyPay, salary, country, expected }) => {
        const actual = calculateMonthsWorthOfSalary(
          redundancyPay,
          salary,
          country,
        );

        expect(actual.toFixed(1)).toStrictEqual(expected);
      },
    );
  });
});
