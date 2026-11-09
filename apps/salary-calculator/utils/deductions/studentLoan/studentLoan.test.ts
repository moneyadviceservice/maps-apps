import {
  calculateCombinedStudentLoanRepayments,
  calculateStudentLoanRepayments,
} from './studentLoan';

describe('calculateStudentLoanRepayments', () => {
  const expectationsPlan1 = [
    { taxableAnnualIncome: 15_000, repayments: 0 },
    { taxableAnnualIncome: 17_500, repayments: 0 },
    { taxableAnnualIncome: 20_000, repayments: 0 },
    { taxableAnnualIncome: 22_500, repayments: 207 },
    { taxableAnnualIncome: 25_000, repayments: 432 },
    { taxableAnnualIncome: 50_000, repayments: 2682 },
    { taxableAnnualIncome: 55_000, repayments: 3132 },
    { taxableAnnualIncome: 60_000, repayments: 3582 },
    { taxableAnnualIncome: 75_000, repayments: 4932 },
    { taxableAnnualIncome: 90_000, repayments: 6282 },
    { taxableAnnualIncome: 110_000, repayments: 8082 },
    { taxableAnnualIncome: 120_000, repayments: 8982 },
    { taxableAnnualIncome: 124_500, repayments: 9387 },
    { taxableAnnualIncome: 125_000, repayments: 9432 },
    { taxableAnnualIncome: 130_000, repayments: 9882 },
    { taxableAnnualIncome: 145_000, repayments: 11232 },
    { taxableAnnualIncome: 160_000, repayments: 12582 },
    { taxableAnnualIncome: 175_000, repayments: 13932 },
    { taxableAnnualIncome: 200_000, repayments: 16182 },
    { taxableAnnualIncome: 250_000, repayments: 20682 },
    { taxableAnnualIncome: 500_000, repayments: 43182 },
    { taxableAnnualIncome: 1_000_000, repayments: 88182 },
  ];

  describe('Plan 1 loans', () => {
    for (const { taxableAnnualIncome, repayments } of expectationsPlan1) {
      test(taxableAnnualIncome.toString(), () => {
        expect(
          calculateStudentLoanRepayments({
            taxYear: '2022/23',
            taxableAnnualIncome,
            selectedStudentLoanPlans: [true, false, false, false, false],
          }),
        ).toEqual(repayments);
      });
    }
  });

  const expectationsPlan2 = [
    { taxableAnnualIncome: 15_000, repayments: 0 },
    { taxableAnnualIncome: 17_500, repayments: 0 },
    { taxableAnnualIncome: 20_000, repayments: 0 },
    { taxableAnnualIncome: 22_500, repayments: 0 },
    { taxableAnnualIncome: 25_000, repayments: 0 },
    { taxableAnnualIncome: 50_000, repayments: 2043 },
    { taxableAnnualIncome: 55_000, repayments: 2493 },
    { taxableAnnualIncome: 60_000, repayments: 2943 },
    { taxableAnnualIncome: 75_000, repayments: 4293 },
    { taxableAnnualIncome: 90_000, repayments: 5643 },
    { taxableAnnualIncome: 110_000, repayments: 7443 },
    { taxableAnnualIncome: 120_000, repayments: 8343 },
    { taxableAnnualIncome: 124_500, repayments: 8748 },
    { taxableAnnualIncome: 125_000, repayments: 8793 },
    { taxableAnnualIncome: 130_000, repayments: 9243 },
    { taxableAnnualIncome: 145_000, repayments: 10593 },
    { taxableAnnualIncome: 160_000, repayments: 11943 },
    { taxableAnnualIncome: 175_000, repayments: 13293 },
    { taxableAnnualIncome: 200_000, repayments: 15543 },
    { taxableAnnualIncome: 250_000, repayments: 20043 },
    { taxableAnnualIncome: 500_000, repayments: 42543 },
    { taxableAnnualIncome: 1_000_000, repayments: 87543 },
  ];

  describe('Plan 2 loans', () => {
    for (const { taxableAnnualIncome, repayments } of expectationsPlan2) {
      test(taxableAnnualIncome.toString(), () => {
        expect(
          calculateStudentLoanRepayments({
            taxYear: '2022/23',
            taxableAnnualIncome,
            selectedStudentLoanPlans: [false, true, false, false, false],
          }),
        ).toEqual(repayments);
      });
    }
  });

  const expectationsPlan4 = [
    { taxableAnnualIncome: 15_000, repayments: 0 },
    { taxableAnnualIncome: 17_500, repayments: 0 },
    { taxableAnnualIncome: 20_000, repayments: 0 },
    { taxableAnnualIncome: 22_500, repayments: 0 },
    { taxableAnnualIncome: 25_000, repayments: 0 },
    { taxableAnnualIncome: 50_000, repayments: 2216 },
    { taxableAnnualIncome: 55_000, repayments: 2666 },
    { taxableAnnualIncome: 60_000, repayments: 3116 },
    { taxableAnnualIncome: 75_000, repayments: 4466 },
    { taxableAnnualIncome: 90_000, repayments: 5816 },
    { taxableAnnualIncome: 110_000, repayments: 7616 },
    { taxableAnnualIncome: 120_000, repayments: 8516 },
    { taxableAnnualIncome: 124_500, repayments: 8921 },
    { taxableAnnualIncome: 125_000, repayments: 8966 },
    { taxableAnnualIncome: 130_000, repayments: 9416 },
    { taxableAnnualIncome: 145_000, repayments: 10766 },
    { taxableAnnualIncome: 160_000, repayments: 12116 },
    { taxableAnnualIncome: 175_000, repayments: 13466 },
    { taxableAnnualIncome: 200_000, repayments: 15716 },
    { taxableAnnualIncome: 250_000, repayments: 20216 },
    { taxableAnnualIncome: 500_000, repayments: 42716 },
    { taxableAnnualIncome: 1_000_000, repayments: 87716 },
  ];

  describe('Plan 4 loans', () => {
    for (const { taxableAnnualIncome, repayments } of expectationsPlan4) {
      test(taxableAnnualIncome.toString(), () => {
        expect(
          calculateStudentLoanRepayments({
            taxYear: '2022/23',
            taxableAnnualIncome,
            selectedStudentLoanPlans: [false, false, true, false, false],
          }),
        ).toEqual(repayments);
      });
    }
  });

  const expectationsPlan5 = [
    { taxableAnnualIncome: 15_000, repayments: 0 },
    { taxableAnnualIncome: 17_500, repayments: 0 },
    { taxableAnnualIncome: 20_000, repayments: 0 },
    { taxableAnnualIncome: 22_500, repayments: 0 },
    { taxableAnnualIncome: 25_000, repayments: 0 },
    { taxableAnnualIncome: 50_000, repayments: 2250 },
    { taxableAnnualIncome: 55_000, repayments: 2700 },
    { taxableAnnualIncome: 60_000, repayments: 3150 },
    { taxableAnnualIncome: 75_000, repayments: 4500 },
    { taxableAnnualIncome: 90_000, repayments: 5850 },
    { taxableAnnualIncome: 110_000, repayments: 7650 },
    { taxableAnnualIncome: 120_000, repayments: 8550 },
    { taxableAnnualIncome: 124_500, repayments: 8955 },
    { taxableAnnualIncome: 125_000, repayments: 9000 },
    { taxableAnnualIncome: 130_000, repayments: 9450 },
    { taxableAnnualIncome: 145_000, repayments: 10800 },
    { taxableAnnualIncome: 160_000, repayments: 12150 },
    { taxableAnnualIncome: 175_000, repayments: 13500 },
    { taxableAnnualIncome: 200_000, repayments: 15750 },
    { taxableAnnualIncome: 250_000, repayments: 20250 },
    { taxableAnnualIncome: 500_000, repayments: 42750 },
    { taxableAnnualIncome: 1_000_000, repayments: 87750 },
  ];

  describe('Plan 5 loans', () => {
    for (const { taxableAnnualIncome, repayments } of expectationsPlan5) {
      test(taxableAnnualIncome.toString(), () => {
        expect(
          calculateStudentLoanRepayments({
            taxYear: '2022/23',
            taxableAnnualIncome,
            selectedStudentLoanPlans: [false, false, false, true, false],
          }),
        ).toEqual(repayments);
      });
    }
  });

  const expectationsPostgrad = [
    { taxableAnnualIncome: 15_000, repayments: 0 },
    { taxableAnnualIncome: 17_500, repayments: 0 },
    { taxableAnnualIncome: 20_000, repayments: 0 },
    { taxableAnnualIncome: 22_500, repayments: 90 },
    { taxableAnnualIncome: 25_000, repayments: 240 },
    { taxableAnnualIncome: 50_000, repayments: 1740 },
    { taxableAnnualIncome: 55_000, repayments: 2040 },
    { taxableAnnualIncome: 60_000, repayments: 2340 },
    { taxableAnnualIncome: 75_000, repayments: 3240 },
    { taxableAnnualIncome: 90_000, repayments: 4140 },
    { taxableAnnualIncome: 110_000, repayments: 5340 },
    { taxableAnnualIncome: 120_000, repayments: 5940 },
    { taxableAnnualIncome: 124_500, repayments: 6210 },
    { taxableAnnualIncome: 125_000, repayments: 6240 },
    { taxableAnnualIncome: 130_000, repayments: 6540 },
    { taxableAnnualIncome: 145_000, repayments: 7440 },
    { taxableAnnualIncome: 160_000, repayments: 8340 },
    { taxableAnnualIncome: 175_000, repayments: 9240 },
    { taxableAnnualIncome: 200_000, repayments: 10740 },
    { taxableAnnualIncome: 250_000, repayments: 13740 },
    { taxableAnnualIncome: 500_000, repayments: 28740 },
    { taxableAnnualIncome: 1_000_000, repayments: 58740 },
  ];

  describe('Postgrad loans', () => {
    for (const { taxableAnnualIncome, repayments } of expectationsPostgrad) {
      test(taxableAnnualIncome.toString(), () => {
        expect(
          calculateStudentLoanRepayments({
            taxYear: '2022/23',
            taxableAnnualIncome,
            selectedStudentLoanPlans: [false, false, false, false, true],
          }),
        ).toEqual(repayments);
      });
    }
  });

  const expectationsCombinedPlan5Postgrad = [
    { taxableAnnualIncome: 15_000, repayments: { undergrad: 0, postgrad: 0 } },
    { taxableAnnualIncome: 17_500, repayments: { undergrad: 0, postgrad: 0 } },
    { taxableAnnualIncome: 20_000, repayments: { undergrad: 0, postgrad: 0 } },
    { taxableAnnualIncome: 22_500, repayments: { undergrad: 0, postgrad: 90 } },
    {
      taxableAnnualIncome: 25_000,
      repayments: { undergrad: 0, postgrad: 240 },
    },
    {
      taxableAnnualIncome: 50_000,
      repayments: { undergrad: 2250, postgrad: 1740 },
    },
    {
      taxableAnnualIncome: 55_000,
      repayments: { undergrad: 2700, postgrad: 2040 },
    },
    {
      taxableAnnualIncome: 60_000,
      repayments: { undergrad: 3150, postgrad: 2340 },
    },
    {
      taxableAnnualIncome: 75_000,
      repayments: { undergrad: 4500, postgrad: 3240 },
    },
    {
      taxableAnnualIncome: 90_000,
      repayments: { undergrad: 5850, postgrad: 4140 },
    },
    {
      taxableAnnualIncome: 110_000,
      repayments: { undergrad: 7650, postgrad: 5340 },
    },
    {
      taxableAnnualIncome: 120_000,
      repayments: { undergrad: 8550, postgrad: 5940 },
    },
    {
      taxableAnnualIncome: 124_500,
      repayments: { undergrad: 8955, postgrad: 6210 },
    },
    {
      taxableAnnualIncome: 125_000,
      repayments: { undergrad: 9000, postgrad: 6240 },
    },
    {
      taxableAnnualIncome: 130_000,
      repayments: { undergrad: 9450, postgrad: 6540 },
    },
    {
      taxableAnnualIncome: 145_000,
      repayments: { undergrad: 10800, postgrad: 7440 },
    },
    {
      taxableAnnualIncome: 160_000,
      repayments: { undergrad: 12150, postgrad: 8340 },
    },
    {
      taxableAnnualIncome: 175_000,
      repayments: { undergrad: 13500, postgrad: 9240 },
    },
    {
      taxableAnnualIncome: 200_000,
      repayments: { undergrad: 15750, postgrad: 10740 },
    },
    {
      taxableAnnualIncome: 250_000,
      repayments: { undergrad: 20250, postgrad: 13740 },
    },
    {
      taxableAnnualIncome: 500_000,
      repayments: { undergrad: 42750, postgrad: 28740 },
    },
    {
      taxableAnnualIncome: 1_000_000,
      repayments: { undergrad: 87750, postgrad: 58740 },
    },
  ];

  describe('Combined Plan 5 and Postgrad loans', () => {
    for (const {
      taxableAnnualIncome,
      repayments,
    } of expectationsCombinedPlan5Postgrad) {
      test(taxableAnnualIncome.toString(), () => {
        const result = calculateCombinedStudentLoanRepayments({
          taxYear: '2022/23',
          taxableAnnualIncome,
          selectedStudentLoanPlans: [false, false, false, true, true],
          daysPerWeek: 5,
        });

        expect(result.repayments.undergrad.selected).toEqual(true);
        expect(result.repayments.undergrad.amount.yearly).toEqual(
          repayments.undergrad,
        );

        expect(result.repayments.postgrad.selected).toEqual(true);
        expect(result.repayments.postgrad.amount.yearly).toEqual(
          repayments.postgrad,
        );
      });
    }
  });
});
