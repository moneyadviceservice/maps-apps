export type StatePensionSelector = {
  selectStatePension: (
    option?: 'yes' | 'no',
    salaryNumber?: 1 | 2,
  ) => Promise<void>;
};

export async function applyStatePension(
  calculator: StatePensionSelector,
  option: 'yes' | 'no' | undefined,
  salaryNumber: 1 | 2 = 1,
): Promise<void> {
  // No need for an if here – the page method already handles undefined
  await calculator.selectStatePension(option, salaryNumber);
}
