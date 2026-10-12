import { isNextFinancialYear } from './isNextFinancialYear';

describe('Redundancy pay calculator helper functions', () => {
  describe('isNextFinancialYear', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-05-01'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it.each`
      date            | ignoreDay | expected
      ${'2025-08-05'} | ${false}  | ${0}
      ${'2026-08-05'} | ${false}  | ${1}
      ${'2025-03-05'} | ${false}  | ${-1}
      ${'2025-08-06'} | ${true}   | ${0}
      ${'2026-08-06'} | ${true}   | ${1}
      ${'2025-02-05'} | ${true}   | ${-1}
    `(
      'should return $expected given date is $date, ignoreDay is $ignoreDay and the current date is set to 2020-03-19',
      ({ date, ignoreDay, expected }) => {
        expect(isNextFinancialYear(new Date(date), ignoreDay)).toEqual(
          expected,
        );
      },
    );
  });
});
