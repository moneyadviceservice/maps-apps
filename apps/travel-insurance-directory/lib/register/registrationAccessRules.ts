import { FIRST_REGISTER_PATH } from 'types/CONSTANTS';

import type { IronSessionData } from 'iron-session';

/**
 * Registration step that a page belongs to. Used by GSSP guards so deep-links to
 * later steps redirect when the shared `tid_account_session` cookie is missing
 * prerequisite data (e.g. OTP completed but no `db_id` yet).
 */
export type RegistrationAccessRequirement = 'fca' | 'firm' | 'save' | 'result';

function hasFcaData(session: IronSessionData): boolean {
  return Boolean(session.fcaData?.frnNumber?.trim());
}

function hasUserEmail(session: IronSessionData): boolean {
  return Boolean(session.userData?.mail?.trim());
}

function hasFirmId(session: IronSessionData): boolean {
  return Boolean(session.db_id?.trim());
}

function getFirmAccessRedirect(session: IronSessionData): string | null {
  if (hasFirmId(session)) {
    return null;
  }

  return hasFcaData(session) ? FIRST_REGISTER_PATH : '/register/fca';
}

function getSaveAccessRedirect(session: IronSessionData): string | null {
  if (hasFirmId(session) && hasUserEmail(session)) {
    return null;
  }

  return hasFcaData(session) ? FIRST_REGISTER_PATH : '/register/fca';
}

/**
 * Returns a redirect destination when the session does not meet the step
 * requirement, or null when access is allowed.
 *
 * Redirect chain mirrors the happy-path order: fca → user → firm steps → save → result.
 * `/register` and `/register/fca` are intentionally unguarded entry points.
 */
export function getRegistrationAccessRedirect(
  session: IronSessionData,
  requirement: RegistrationAccessRequirement,
): string | null {
  switch (requirement) {
    case 'fca':
      return hasFcaData(session) ? null : '/register/fca';
    case 'firm':
      return getFirmAccessRedirect(session);
    case 'save':
      return getSaveAccessRedirect(session);
    case 'result':
      return hasFirmId(session) ? null : '/register';
    default:
      return '/register';
  }
}
