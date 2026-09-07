import {
  calculateStatutoryRedundancyPay,
  getWeeklyPayCap,
  calculateYearlyPay,
} from '.';

import {
  WEEKLY_PAY_CAP,
  WEEKLY_PAY_CAP_PRE_2026,
  WEEKLY_PAY_CAP_NI,
  WEEKLY_PAY_CAP_NI_PRE_2026,
  MONTHS_IN_YEAR,
  WEEKS_IN_YEAR,
} from '../../CONSTANTS';

describe('Redundancy pay calculator helper functions', () => {
  describe('calculateStatutoryRedundancyPay', () => {
    it.each`
      scenario | dateOfBirth     | salary                              | jobStart     | jobEnd       | country | expected
      ${1}     | ${'4-5-1980'}   | ${{ amount: 15000, frequency: 0 }}  | ${'3-2021'}  | ${'2-2026'}  | ${0}    | ${{ amount: 1731, entitlementWeeks: 6 }}
      ${2}     | ${'23-10-1984'} | ${{ amount: 32650, frequency: 0 }}  | ${'6-2016'}  | ${'5-2026'}  | ${3}    | ${{ amount: 5651, entitlementWeeks: 9 }}
      ${3}     | ${'12-1-1958'}  | ${{ amount: 798, frequency: 2 }}    | ${'4-2021'}  | ${'12-2026'} | ${2}    | ${{ amount: 5633, entitlementWeeks: 7.5 }}
      ${4}     | ${'1-1-2000'}   | ${{ amount: 2640, frequency: 1 }}   | ${'12-2020'} | ${'8-2026'}  | ${1}    | ${{ amount: 2742, entitlementWeeks: 4.5 }}
      ${5}     | ${'1-1-2003'}   | ${{ amount: 23000, frequency: 0 }}  | ${'12-2020'} | ${'8-2026'}  | ${0}    | ${{ amount: 1327, entitlementWeeks: 3 }}
      ${6}     | ${'10-10-1974'} | ${{ amount: 91000, frequency: 0 }}  | ${'2-2023'}  | ${'3-2026'}  | ${0}    | ${{ amount: 3236, entitlementWeeks: 4.5 }}
      ${7}     | ${'8-2-1993'}   | ${{ amount: 154000, frequency: 0 }} | ${'5-2024'}  | ${'4-2026'}  | ${1}    | ${{ amount: 0, entitlementWeeks: 0 }}
      ${8}     | ${'30-11-1979'} | ${{ amount: 78514, frequency: 0 }}  | ${'1-2008'}  | ${'3-2026'}  | ${0}    | ${{ amount: 14740, entitlementWeeks: 20.5 }}
      ${9}     | ${'9-9-1998'}   | ${{ amount: 41500, frequency: 0 }}  | ${'7-2020'}  | ${'8-2026'}  | ${3}    | ${{ amount: 4307, entitlementWeeks: 5.5 }}
      ${10}    | ${'26-3-1969'}  | ${{ amount: 52943, frequency: 0 }}  | ${'5-2000'}  | ${'3-2026'}  | ${0}    | ${{ amount: 19773, entitlementWeeks: 27.5 }}
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

    it('returns 0 if below minimum years of employment', () => {
      const result = calculateStatutoryRedundancyPay({
        dateOfBirth: '1-1-2000',
        salary: { amount: 30000, frequency: 0 },
        jobStart: '1-2024',
        jobEnd: '1-2025', // < 2 years
        country: 0,
      });

      expect(result).toStrictEqual({ amount: 0, entitlementWeeks: 0 });
    });
  }); // end of calculateStatutoryRedundancyPay describe

  describe('getWeeklyPayCap', () => {
    const beforeCutoff = '2-2026'; // Feb 2026
    const afterCutoff = '4-2026'; // April 2026

    describe('Northern Ireland (country === 3)', () => {
      it('returns pre-2026 cap before cutoff', () => {
        expect(getWeeklyPayCap(3, beforeCutoff)).toBe(
          WEEKLY_PAY_CAP_NI_PRE_2026,
        );
      });
      it('returns new cap after cutoff', () => {
        expect(getWeeklyPayCap(3, afterCutoff)).toBe(WEEKLY_PAY_CAP_NI);
      });
    });

    describe('England/Scotland/Wales (country !== 3)', () => {
      it('returns pre-2026 cap before cutoff', () => {
        expect(getWeeklyPayCap(0, beforeCutoff)).toBe(WEEKLY_PAY_CAP_PRE_2026);
      });
      it('returns new cap after cutoff', () => {
        expect(getWeeklyPayCap(0, afterCutoff)).toBe(WEEKLY_PAY_CAP);
      });
    });
  });

  describe('calculateYearlyPay', () => {
    const cases = [
      { frequency: 0, amount: 50000, expected: 50000 },
      { frequency: 1, amount: 2000, expected: 2000 * MONTHS_IN_YEAR },
      { frequency: 2, amount: 500, expected: 500 * WEEKS_IN_YEAR },
    ];

    it.each(cases)(
      'frequency $frequency converts correctly',
      ({ frequency, amount, expected }) => {
        expect(calculateYearlyPay({ amount, frequency })).toBe(expected);
      },
    );
  });
});
