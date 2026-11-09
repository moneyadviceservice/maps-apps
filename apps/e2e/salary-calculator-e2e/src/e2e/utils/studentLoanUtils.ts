export type StudentLoanSelector = {
  selectStudentLoanPlans: (
    plans?: string[],
    salaryNumber?: 1 | 2,
  ) => Promise<void>;
};

export async function applyStudentLoanPlans(
  calculator: StudentLoanSelector,
  plans: string[] | undefined,
  salaryNumber: 1 | 2 = 1,
): Promise<void> {
  // No conditionals here – delegate everything to the page method
  await calculator.selectStudentLoanPlans(plans, salaryNumber);
}
