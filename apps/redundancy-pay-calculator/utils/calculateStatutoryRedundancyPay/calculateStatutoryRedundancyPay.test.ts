import { calculateStatutoryRedundancyPay } from '.';

describe('Redundancy pay calculator helper functions', () => {
  describe('calculateStatutoryRedundancyPay', () => {
    it.each`
      scenario | dateOfBirth     | salary                              | jobStart     | jobEnd       | country | expected
      ${1}     | ${'4-5-1980'}   | ${{ amount: 15000, frequency: 0 }}  | ${'3-2020'}  | ${'2-2025'}  | ${0}    | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${2}     | ${'23-10-1984'} | ${{ amount: 32650, frequency: 0 }}  | ${'6-2015'}  | ${'5-2025'}  | ${3}    | ${{ amount: 5651, entitlementWeeks: 9 }}
      ${3}     | ${'12-1-1958'}  | ${{ amount: 798, frequency: 2 }}    | ${'4-2020'}  | ${'12-2025'} | ${2}    | ${{ amount: 5393, entitlementWeeks: 7.5 }}
      ${4}     | ${'1-1-2000'}   | ${{ amount: 2640, frequency: 1 }}   | ${'12-2018'} | ${'8-2025'}  | ${1}    | ${{ amount: 2742, entitlementWeeks: 4.5 }}
      ${5}     | ${'1-1-2003'}   | ${{ amount: 23000, frequency: 0 }}  | ${'12-2018'} | ${'8-2025'}  | ${0}    | ${{ amount: 1327, entitlementWeeks: 3 }}
      ${6}     | ${'10-10-1974'} | ${{ amount: 91000, frequency: 0 }}  | ${'2-2022'}  | ${'3-2025'}  | ${0}    | ${{ amount: 3150, entitlementWeeks: 4.5 }}
      ${7}     | ${'8-2-1993'}   | ${{ amount: 154000, frequency: 0 }} | ${'5-2023'}  | ${'4-2025'}  | ${1}    | ${{ amount: 0, entitlementWeeks: 0 }}
      ${8}     | ${'30-11-1979'} | ${{ amount: 78514, frequency: 0 }}  | ${'1-2007'}  | ${'3-2025'}  | ${0}    | ${{ amount: 14000, entitlementWeeks: 20 }}
      ${9}     | ${'9-9-1998'}   | ${{ amount: 41500, frequency: 0 }}  | ${'7-2019'}  | ${'8-2025'}  | ${3}    | ${{ amount: 3745, entitlementWeeks: 5 }}
      ${10}    | ${'26-3-1969'}  | ${{ amount: 52943, frequency: 0 }}  | ${'5-1999'}  | ${'3-2025'}  | ${0}    | ${{ amount: 18900, entitlementWeeks: 27 }}
    `(
      'should calculate the correct redundancy pay for Scenario #$scenario ($dateOfBirth, $salary, $jobStart, $jobEnd, $country)',
      ({ dateOfBirth, salary, jobStart, jobEnd, country, expected }) => {
        const actual = calculateStatutoryRedundancyPay({
          dateOfBirth,
          salary,
          jobStart,
          jobEnd,
          country,
        });

        expect(actual).toStrictEqual(expected);
      },
    );
  });
});
