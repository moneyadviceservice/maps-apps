export type Group = {
  title: string;
  group: string;
  descritionScoreOne?: string;
  descritionScoreTwo?: string;
  descritionScoreThree?: string;
};

export type Links = {
  title: string;
  link: string;
  type: string;
  description?: string;
};

export type FormContentAnlyticsData = {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[] | string;
  categoryLevels?: string[];
};

export const FORM_FIELDS = {
  day: 'day',
  month: 'month',
  year: 'year',
  dueDateMin: 'dueDateMin',
  invalidDate: 'invalidDate',
} as const;

export type Fields = {
  [Key in keyof typeof FORM_FIELDS]: string;
};
