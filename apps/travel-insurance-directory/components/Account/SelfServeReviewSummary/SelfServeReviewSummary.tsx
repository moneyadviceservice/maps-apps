import type { SelfServeReviewSummaryProps } from 'lib/account/reviewSummary/types';

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
