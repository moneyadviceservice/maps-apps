export type BlindPersonSelector = {
  selectBlindPerson: (
    value: 'yes' | 'no',
    salaryNumber: 1 | 2,
  ) => Promise<void>;
};

export async function applyBlindPerson(
  calculator: BlindPersonSelector,
  value: 'yes' | 'no' | undefined,
  salaryNumber: 1 | 2 = 1,
): Promise<void> {
  if (value) {
    await calculator.selectBlindPerson(value, salaryNumber);
  }
}
