export type ReviewSummaryRow = {
  id: string;
  heading: string;
  answer: string;
  changeTargetPath: string;
};

export type ReviewSummarySection = {
  heading: string;
  questionColumnLabel: string;
  answerColumnLabel: string;
  rows: ReviewSummaryRow[];
};

export type SelfServeReviewSummaryProps = {
  sections: ReviewSummarySection[];
  changeAnswerApi: string;
  changeAnswerHiddenFields?: Record<string, string>;
};
