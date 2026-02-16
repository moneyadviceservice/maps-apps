import { SummaryResultsChecklist } from './SummaryResultsChecklist';
import { SummaryResultsDetails } from './SummaryResultsDetails';
import { SummaryResultsOtherTools } from './SummaryResultsOtherTools';
import { SummaryResultsShare } from './SummaryResultsShare';

export const SummaryResults = () => {
  return (
    <div className="space-y-8">
      <SummaryResultsDetails />
      <SummaryResultsChecklist />
      <SummaryResultsOtherTools />
      <div className="pt-8 border-t-1 border-slate-400">
        [FEEDBACK PLACEHOLDER]
      </div>
      <SummaryResultsShare />
    </div>
  );
};
