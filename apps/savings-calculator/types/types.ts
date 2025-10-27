export type FormContentAnlyticsData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[] | string;
  categoryLevels?: string[];
};

export enum SavingsCalculatorType {
  HOW_MUCH = 'how-much',
  HOW_LONG = 'how-long',
}
