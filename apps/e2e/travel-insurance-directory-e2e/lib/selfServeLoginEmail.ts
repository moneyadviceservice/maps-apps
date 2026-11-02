import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { SELF_SERVE_EMAIL_FILE } from '../helpers/auth.constants';

const sanitizeEmailLocalPart = (value: string): string =>
  value.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');

/**
 * Stable id for this pipeline *instance* (Azure Build.BuildId), or a
 * machine-local id when not in CI. Must not include pid/timestamp so every
 * Playwright worker and global teardown resolve the same address.
 */
const resolveRunId = (): string => {
  const override = process.env.TID_E2E_SELF_SERVE_RUN_ID?.trim();
  if (override) {
    return sanitizeEmailLocalPart(override);
  }

  // Azure DevOps: Build.BuildId is unique per pipeline run (instance).
  const buildId = process.env.BUILD_BUILDID?.trim();
  if (buildId) {
    return sanitizeEmailLocalPart(buildId);
  }

  // Other common CI providers
  const githubRunId = process.env.GITHUB_RUN_ID?.trim();
  if (githubRunId) {
    return sanitizeEmailLocalPart(
      [githubRunId, process.env.GITHUB_RUN_ATTEMPT].filter(Boolean).join('-'),
    );
  }

  return sanitizeEmailLocalPart(
    [os.hostname(), os.userInfo().username, 'local'].join('-'),
  );
};

/** Build the email for this run from env / pipeline id (ignores any stale file). */
export const createSelfServeLoginEmailForRun = (): string => {
  const fromEnv = process.env.TID_E2E_SELF_SERVE_EMAIL?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return `e2e-user+${resolveRunId()}@test.com`;
};

/**
 * Resolves the self-serve login email shared by all workers for this run.
 * Prefer `.auth/self-serve-email.txt` written by global setup so every process
 * uses one Cosmos firm.
 */
export const resolveSelfServeLoginEmail = (): string => {
  try {
    const existing = fs.readFileSync(SELF_SERVE_EMAIL_FILE, 'utf8').trim();
    if (existing.includes('@')) {
      return existing;
    }
  } catch {
    // File not written yet — fall through and generate.
  }

  return createSelfServeLoginEmailForRun();
};

/** Persist the run email so workers and global teardown share one address. */
export const persistSelfServeLoginEmail = (email: string): string => {
  fs.mkdirSync(path.dirname(SELF_SERVE_EMAIL_FILE), { recursive: true });
  fs.writeFileSync(SELF_SERVE_EMAIL_FILE, email, 'utf8');
  return email;
};
