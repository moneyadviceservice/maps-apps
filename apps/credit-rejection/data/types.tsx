export type Group = {
  title: string;
  group: string;
  descritionScoreOne?: string;
  descritionScoreTwo?: string;
  descritionScoreThree?: string;
};

export type Condition = {
  question: string;
  answer: string;
  arithmeticOperator?: string;
};
