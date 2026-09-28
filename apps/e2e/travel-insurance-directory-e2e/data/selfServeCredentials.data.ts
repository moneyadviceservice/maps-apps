import {
  persistSelfServeLoginEmail,
  resolveSelfServeLoginEmail,
} from '../lib/selfServeLoginEmail';

/**
 * Firm metadata fields (FRN, registered/trading names) stay in sync with
 * `selfServeE2eConstants` in the travel-insurance-directory app.
 * ACCOUNT_LOGIN_EMAIL is unique per pipeline instance (or local machine).
 *
 * Prefer the address persisted by Playwright global setup when present.
 */
const accountLoginEmail = persistSelfServeLoginEmail(
  resolveSelfServeLoginEmail(),
);

export const selfServeCreds = {
  ACCOUNT_LOGIN_EMAIL: accountLoginEmail,
  UNKNOWN_USER_E2E_EMAIL: 'unknown-user-e2e@maps.test',
  INVALID_EMAIL: 'not-an-email',
  VALID_OTP: '123456',
  DEFAULT_REGISTERED_NAME: 'e2e main firm',
  DEFAULT_FRN: '123456',
  DEFAULT_TRADING_NAME: 'trading firm e2e 1',
} as const;
