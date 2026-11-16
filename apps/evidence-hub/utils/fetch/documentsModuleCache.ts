/**
 * In-memory slim/search cache for a single Node process (per buildId).
 * Tests import `clearSlimModuleCache` directly from this module.
 */
export const slimModuleCache = {
  buildId: null as string | null,
  docsSlim: null as unknown,
  searchBySlug: null as unknown,
  ensureInFlight: null as Promise<unknown> | null,
};

export function clearSlimModuleCache(): void {
  slimModuleCache.buildId = null;
  slimModuleCache.docsSlim = null;
  slimModuleCache.searchBySlug = null;
  slimModuleCache.ensureInFlight = null;
}
