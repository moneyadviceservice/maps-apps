export type PensionSelector = {
  enterPensionPercent: (percent: string, salaryNumber?: 1 | 2) => Promise<void>;
  enterPensionFixed: (amount: string, salaryNumber?: 1 | 2) => Promise<void>;
  enterEmployerPensionPercent: (
    percent: string,
    salaryNumber?: 1 | 2,
  ) => Promise<void>;
  enterEmployerPensionFixed: (
    amount: string,
    salaryNumber?: 1 | 2,
  ) => Promise<void>;
};

export type PensionInputs = {
  pensionPercent?: string;
  pensionFixed?: string;
  employerPensionPercent?: string;
  employerPensionFixed?: string;
};

export async function applyPension(
  calculator: PensionSelector,
  inputs: PensionInputs,
  salaryNumber: 1 | 2 = 1,
): Promise<void> {
  // No conditionals in the test — all logic lives here
  if (inputs.pensionPercent) {
    await calculator.enterPensionPercent(inputs.pensionPercent, salaryNumber);
  } else if (inputs.pensionFixed) {
    await calculator.enterPensionFixed(inputs.pensionFixed, salaryNumber);
  }

  if (inputs.employerPensionPercent) {
    await calculator.enterEmployerPensionPercent(
      inputs.employerPensionPercent,
      salaryNumber,
    );
  } else if (inputs.employerPensionFixed) {
    await calculator.enterEmployerPensionFixed(
      inputs.employerPensionFixed,
      salaryNumber,
    );
  }
}
