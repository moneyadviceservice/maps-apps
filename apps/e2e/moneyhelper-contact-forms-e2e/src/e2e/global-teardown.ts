import { stopMockApi } from './mocks/mock-api';

export default async function globalTeardown() {
  await stopMockApi();
  console.log('[global-teardown] 🛑 Mock API server stopped');
}
