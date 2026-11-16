import type { IronSessionData } from 'iron-session';
import { SUCCESS_REDIRECT_PATH } from 'types/CONSTANTS';
import { SPECIFIC_CONDITION_KEYS } from 'lib/firms/firmDefaults';
import type {
  MainTravelInsuranceFirmDocument,
  MedicalConditionAnswer,
} from 'types/travel-insurance-firm';

import {
  hasActivePendingReregistration,
  isInRenewalWindow,
} from './reregistrationState';

/** Answers required across medical-specific_conditions before registration is considered complete. */
export const REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT = 19;

/** Minimum number of 'true' answers required for pre-approval (register confirm). */
export const REQUIRED_HIGH_RISK_TRUE_COUNT = 15;

function isAnswered(value: MedicalConditionAnswer | undefined): boolean {
  return value === 'true' || value === 'false';
}

export function getAnsweredMedicalConditionsCount(
  firm: MainTravelInsuranceFirmDocument,
): number {
  const conditions =
    firm.renewal_draft?.medical_coverage?.specific_conditions ??
    firm.medical_coverage?.specific_conditions;
  if (!conditions || typeof conditions !== 'object') {
    return 0;
  }

  return SPECIFIC_CONDITION_KEYS.filter((key) => isAnswered(conditions[key]))
    .length;
}

export function isRegistrationIncomplete(
  firm: MainTravelInsuranceFirmDocument,
): boolean {
  return (
    getAnsweredMedicalConditionsCount(firm) <
    REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT
  );
}

export function getTrueMedicalConditionsCount(
  firm: MainTravelInsuranceFirmDocument,
): number {
  const conditions =
    firm.renewal_draft?.medical_coverage?.specific_conditions ??
    firm.medical_coverage?.specific_conditions;
  if (!conditions || typeof conditions !== 'object') {
    return 0;
  }

  return SPECIFIC_CONDITION_KEYS.filter((key) => conditions[key] === 'true')
    .length;
}

/** All 19 scenario questions answered and at least 15 are 'true' (register confirm success). */
export function isRegistrationPreApproved(
  firm: MainTravelInsuranceFirmDocument,
): boolean {
  return (
    getAnsweredMedicalConditionsCount(firm) >=
      REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT &&
    getTrueMedicalConditionsCount(firm) >= REQUIRED_HIGH_RISK_TRUE_COUNT
  );
}

/** Registration confirm succeeded (initial or re-registration). */
export function hasSuccessfulRegistrationApproval(
  firm: Pick<
    MainTravelInsuranceFirmDocument,
    'approved_at' | 'reregister_approved_at'
  >,
): boolean {
  return firm.approved_at != null || firm.reregister_approved_at != null;
}

export function shouldShowRegistrationResumeCallout(
  firm: MainTravelInsuranceFirmDocument,
): boolean {
  if (firm.approved_at != null) {
    return false;
  }

  return !isRegistrationPreApproved(firm);
}

function isResumableRegistrationQuestionPath(link: string): boolean {
  return (
    link.startsWith('/register/firm/') || link.startsWith('/register/scenario/')
  );
}

function resolveRegistrationResumeHref(savedProgressLink?: string): string {
  if (
    savedProgressLink &&
    isResumableRegistrationQuestionPath(savedProgressLink)
  ) {
    return savedProgressLink;
  }

  return SUCCESS_REDIRECT_PATH;
}

export function getRegistrationFlowEntryHref(
  session: Pick<IronSessionData, 'savedProgressLink'>,
  firm: MainTravelInsuranceFirmDocument,
  now: Date = new Date(),
): string {
  if (hasActivePendingReregistration(firm) || isRegistrationIncomplete(firm)) {
    if (
      firm.renewal_resume_href &&
      isResumableRegistrationQuestionPath(firm.renewal_resume_href)
    ) {
      return firm.renewal_resume_href;
    }
    return resolveRegistrationResumeHref(session.savedProgressLink);
  }

  // Same entry URL as first registration — draft is created on landing.
  if (isInRenewalWindow(firm, now)) {
    return SUCCESS_REDIRECT_PATH;
  }

  return '/register/confirm-details';
}
