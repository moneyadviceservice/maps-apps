import { stopMockApi } from '@mhbf-e2e/mocks/mock-api';

export default async function globalTeardown(): Promise<void> {
  await stopMockApi();

  console.info('[global-teardown] 🛑 Mock API server stopped');
}
