import {
  createSelfServeLoginEmailForRun,
  persistSelfServeLoginEmail,
} from './lib/selfServeLoginEmail';

/**
 * Runs once before workers start so every process shares one login email /
 * Cosmos firm for this pipeline instance (or local machine).
 * Overwrites any stale email file from a previous build on the agent.
 */
async function globalSetup(): Promise<void> {
  const email = persistSelfServeLoginEmail(createSelfServeLoginEmailForRun());
  console.log(`[global-setup] Self-serve login email for this run: ${email}`);
}

export default globalSetup;
