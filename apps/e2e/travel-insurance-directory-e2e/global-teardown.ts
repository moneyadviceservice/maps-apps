import * as fs from 'node:fs';

import { SELF_SERVE_EMAIL_FILE } from './helpers/auth.constants';

/**
 * Deletes the Cosmos firm created for this run's unique self-serve email.
 * Runs after pass/fail and often after Ctrl+C (when Playwright still invokes teardown).
 * Reads the email persisted by global setup / the test process.
 */
async function globalTeardown(): Promise<void> {
  const baseURL = (process.env.BASE_URL || 'http://localhost:4313').replace(
    /\/$/,
    '',
  );

  let email: string | undefined;
  try {
    email = fs.readFileSync(SELF_SERVE_EMAIL_FILE, 'utf8').trim();
  } catch {
    console.warn(
      '[global-teardown] No self-serve email file; skipping Cosmos cleanup.',
    );
    return;
  }

  if (!email) {
    console.warn('[global-teardown] Empty self-serve email; skipping cleanup.');
    return;
  }

  const url = `${baseURL}/ci/self-serve/cleanup-e2e-firm?email=${encodeURIComponent(
    email,
  )}`;

  try {
    const response = await fetch(url);
    const body = (await response.json().catch(() => null)) as {
      success?: boolean;
      deleted?: boolean;
      error?: string;
    } | null;

    if (!response.ok || body?.success === false) {
      console.warn(
        `[global-teardown] Failed to cleanup e2e firm for ${email}:`,
        body?.error ?? response.statusText,
        body?.error === 'Unauthorized'
          ? '(ensure the Next app is running with CI=true)'
          : '',
      );
      return;
    }

    console.log(
      `[global-teardown] E2E firm cleanup for ${email}:`,
      body?.deleted ? 'deleted' : 'nothing to delete',
    );
  } catch (error) {
    console.warn(
      `[global-teardown] Cleanup request failed for ${email} (is ${baseURL} still up?):`,
      error,
    );
  }
}

export default globalTeardown;
