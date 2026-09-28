import { updateFirm } from 'lib/firms/updateFirm';
import { tidInvalidFrn } from 'lib/notify/tid-invalid-frn';
import { tidReregistration } from 'lib/notify/tid-reregistration';
import { EvaluateFirmStateResult } from 'lib/scheduledJobs/services/evaluateFirmState';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export type ValidationResultArrays = {
  failuresSummary: Array<{ name: string; frn: number; issue: string }>;
  invalidFcaNumbers: number[];
  reactivatedFirms: number[];
  newFailures: number[];
  asyncActions: Promise<unknown>[];
};

export const buildResultArrays = (
  firm: TravelInsuranceFirmDocument,
  evaluation: EvaluateFirmStateResult,
  results: ValidationResultArrays,
) => {
  if (evaluation.isParentInvalid)
    results.invalidFcaNumbers.push(firm.fca_number);
  if (evaluation.failure) results.failuresSummary.push(evaluation.failure);
  if (evaluation.firmUpdates.status === 'hidden')
    results.newFailures.push(firm.fca_number);
  if (evaluation.firmUpdates.status === 'active')
    results.reactivatedFirms.push(firm.fca_number);

  if (Object.keys(evaluation.firmUpdates).length > 0 && firm.id) {
    results.asyncActions.push(updateFirm(firm.id, evaluation.firmUpdates));
  }

  for (const related of evaluation.relatedFirmUpdates ?? []) {
    if (related.id) {
      results.asyncActions.push(updateFirm(related.id, related.updates));
    }
  }

  if (evaluation.notifyTarget) {
    const { firstName, email, emailTemplate } = evaluation.notifyTarget;
    if (emailTemplate === 'tidReregistration') {
      results.asyncActions.push(tidReregistration(firstName, email));
    } else if (emailTemplate === 'tidInvalidFrn') {
      results.asyncActions.push(tidInvalidFrn(firstName, email));
    } else {
      console.warn(
        `Unknown email template for firm ${firm.fca_number}: ${emailTemplate}`,
      );
    }
  }
};
