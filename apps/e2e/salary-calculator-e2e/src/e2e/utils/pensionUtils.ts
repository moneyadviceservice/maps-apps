export type PensionSelector = {
  enterPensionPercent: (percent: string, salaryNumber?: 1 | 2) => Promise<void>;
  enterPensionFixed: (amount: string, salaryNumber?: 1 | 2) => Promise<void>;
};

export async function applyPension(
  calculator: PensionSelector,
  pensionPercent: string | undefined,
  pensionFixed: string | undefined,
  salaryNumber: 1 | 2 = 1,
): Promise<void> {
  // No conditionals in the test — all logic lives here
  if (pensionPercent) {
    await calculator.enterPensionPercent(pensionPercent, salaryNumber);
    return;
  }

  if (pensionFixed) {
    await calculator.enterPensionFixed(pensionFixed, salaryNumber);
  }
}
