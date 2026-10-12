import type { IronSessionData } from 'iron-session';

const REGISTRATION_FIELDS = [
  'fcaData',
  'userData',
  'db_id',
  'savedProgressLink',
  'firmData',
  'firm',
] as const satisfies readonly (keyof IronSessionData)[];

const ACCOUNT_AUTH_FIELDS = [
  'isAccountAuthenticated',
  'accountEmail',
  'accountIdToken',
] as const satisfies readonly (keyof IronSessionData)[];

const FIELDS_TO_CLEAR = [
  ...REGISTRATION_FIELDS,
  ...ACCOUNT_AUTH_FIELDS,
] as const;

/**
 * Clears registration-flow and account login session fields so a new
 * registration starts from a clean slate. Account auth is cleared because
 * `/api/register/start` signs the user out of the account area.
 * Returns true when the session was mutated.
 */
export function clearRegistrationSession(session: IronSessionData): boolean {
  let changed = false;

  for (const field of FIELDS_TO_CLEAR) {
    if (session[field] !== undefined) {
      delete session[field];
      changed = true;
    }
  }

  return changed;
}
