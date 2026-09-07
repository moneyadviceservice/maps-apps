import type {
  MainTravelInsuranceFirmDocument,
  SpecificConditions,
} from 'types/travel-insurance-firm';

import { hasActivePendingReregistration } from './reregistrationState';

/**
 * Live profile answers, or renewal_draft answers when a reregistration is in progress.
 */
export function getRegistrationAnswersSource(
  firm: MainTravelInsuranceFirmDocument,
): MainTravelInsuranceFirmDocument {
  if (!hasActivePendingReregistration(firm) || !firm.renewal_draft) {
    return firm;
  }

  return {
    ...firm,
    covered_by_ombudsman_question:
      firm.renewal_draft.covered_by_ombudsman_question,
    medical_coverage: {
      ...firm.medical_coverage,
      ...firm.renewal_draft.medical_coverage,
    },
    service_details: {
      ...firm.service_details,
      supplies_documentation_when_needed_question:
        firm.renewal_draft.service_details
          .supplies_documentation_when_needed_question,
    },
  };
}

export function getRegistrationScenarioAnswers(
  firm: MainTravelInsuranceFirmDocument,
): SpecificConditions | null {
  const source = getRegistrationAnswersSource(firm);
  return source.medical_coverage?.specific_conditions ?? null;
}
