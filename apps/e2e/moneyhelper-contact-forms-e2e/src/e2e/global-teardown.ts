import { stopMockApi } from './mocks/mock-api';

export default async function globalTeardown() {
  await stopMockApi();
  // eslint-disable-next-line no-console
  console.log('[global-teardown] 🛑 Mock API server stopped');
}
