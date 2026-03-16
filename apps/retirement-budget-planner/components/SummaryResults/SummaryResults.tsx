import { Partner } from 'lib/types/aboutYou';
import { RetirementBudgetPlannerPageProps } from 'lib/types/page.type';

import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';

import { PENSION_SURVEY_IDS } from '../../lib/constants/constants';
import { SummaryResultsChecklist } from './SummaryResultsChecklist';
import { SummaryResultsDetails } from './SummaryResultsDetails';
import { SummaryResultsOtherTools } from './SummaryResultsOtherTools';
import { SummaryResultsShare } from './SummaryResultsShare';

type Props = {
  income: Record<string, string>;
  costs: Record<string, string>;
  divisor: string;
  tabName: string;
  partner: Partner;
} & Pick<RetirementBudgetPlannerPageProps, 'sessionId'>;

export const SummaryResults = ({
  income,
  costs,
  divisor,
  tabName,
  partner,
  sessionId,
}: Props) => {
  return (
    <div className="space-y-8">
      <SummaryResultsDetails
        income={income}
        costs={costs}
        divisor={divisor}
        tabName={tabName}
        partner={partner}
        sessionId={sessionId}
      />
      <SummaryResultsChecklist />
      <SummaryResultsOtherTools />
      <ToolFeedback surveyIds={PENSION_SURVEY_IDS} />
      <SummaryResultsShare />
    </div>
  );
};
