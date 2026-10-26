import { stopMockApi } from '@lib/mock-api.lib';

export default async function globalTeardown() {
  await stopMockApi();
  console.log('[global-teardown] 🛑 Mock API server stopped');
}
