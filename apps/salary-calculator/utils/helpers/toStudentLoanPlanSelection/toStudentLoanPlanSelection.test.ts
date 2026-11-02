import { toStudentLoanPlanSelection } from './toStudentLoanPlanSelection';
import type { StudentLoans } from '../../../types';

describe('toStudentLoanPlanSelection', () => {
  it('returns correct array for all true', () => {
    const loans: StudentLoans = {
      plan1: true,
      plan2: true,
      plan4: true,
      plan5: true,
      planPostGrad: true,
    };
    expect(toStudentLoanPlanSelection(loans)).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it('returns correct array for all false', () => {
    const loans: StudentLoans = {
      plan1: false,
      plan2: false,
      plan4: false,
      plan5: false,
      planPostGrad: false,
    };
    expect(toStudentLoanPlanSelection(loans)).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it('returns correct array for mixed values', () => {
    const loans: StudentLoans = {
      plan1: true,
      plan2: false,
      plan4: true,
      plan5: false,
      planPostGrad: true,
    };
    expect(toStudentLoanPlanSelection(loans)).toEqual([
      true,
      false,
      true,
      false,
      true,
    ]);
  });

  it('defaults missing values to false', () => {
    const loans = {
      plan1: true,
      plan2: undefined,
      plan4: null,
      plan5: false,
      planPostGrad: undefined,
    } as unknown as StudentLoans;
    expect(toStudentLoanPlanSelection(loans)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
  });

  it('handles completely empty object safely', () => {
    const loans = {} as StudentLoans;
    expect(toStudentLoanPlanSelection(loans)).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
