import type {
  ReviewSummarySection,
  SelfServeReviewSummaryProps,
} from 'lib/account/reviewSummary/types';

import { Heading } from '@maps-react/common/components/Heading';

import { SelfServeReviewSummaryTable } from './SelfServeReviewSummaryTable';

export type SelfServeReviewSummarySectionProps = Pick<
  SelfServeReviewSummaryProps,
  'changeAnswerApi' | 'changeAnswerHiddenFields'
> & {
  section: ReviewSummarySection;
};

export const SelfServeReviewSummarySection = ({
  section,
  changeAnswerApi,
  changeAnswerHiddenFields,
}: SelfServeReviewSummarySectionProps) => (
  <section data-testid={`summary-section-${section.heading}`}>
    <Heading level="h2" className="mb-4">
      {section.heading}
    </Heading>
    <SelfServeReviewSummaryTable
      changeAnswerApi={changeAnswerApi}
      changeAnswerHiddenFields={changeAnswerHiddenFields}
      questionColumnLabel={section.questionColumnLabel}
      answerColumnLabel={section.answerColumnLabel}
      rows={section.rows}
    />
  </section>
);
