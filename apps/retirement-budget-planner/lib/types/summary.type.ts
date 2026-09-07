export type SummaryType = {
  income: number;
  spending: number;
};
export type PensionBand = {
  start: Date;
  end: Date | null;
  pensionAge: string;
};
export type Band = {
  start: string;
  end: string | null;
  pensionAge: string;
};
