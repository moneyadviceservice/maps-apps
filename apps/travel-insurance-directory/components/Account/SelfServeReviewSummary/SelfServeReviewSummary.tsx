import type { SelfServeReviewSummaryProps } from 'lib/account/shared/reviewSummary';

import { SelfServeReviewSummarySection } from './SelfServeReviewSummarySection';

export const SelfServeReviewSummary = ({
  sections,
  changeAnswerApi,
  changeAnswerHiddenFields,
}: SelfServeReviewSummaryProps) => (
  <>
    {sections.map((section) => (
      <SelfServeReviewSummarySection
        key={section.heading}
        section={section}
        changeAnswerApi={changeAnswerApi}
        changeAnswerHiddenFields={changeAnswerHiddenFields}
      />
    ))}
  </>
);
