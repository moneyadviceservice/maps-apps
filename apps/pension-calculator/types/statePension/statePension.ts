export type StatePensionData = {
  weeklyAmount: string;
};

export type StatePensionErrors = Record<string, string[]>;

export const defaultStatePensionData = (): StatePensionData => ({
  weeklyAmount: '',
});
