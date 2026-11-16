import { createServer } from 'node:net';
import { ENV } from '@mhbf-e2e/lib/env.lib';
import { startMockApi } from '@mhbf-e2e/mocks/mock-api';

async function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, '127.0.0.1');
  });
}

export default async function globalSetup() {
  // Check if the port is available before starting the server
  const port = ENV.MOCK_API_PORT;
  const isPortAvailable = await checkPort(port);
  if (!isPortAvailable) {
    console.error(
      `[global-setup] ❌ Port ${port} is not available. Please free the port and try again.`,
    );
    process.exit(1);
  }

  await startMockApi();

  console.info('[global-setup] ✅ Mock API server started');
}
