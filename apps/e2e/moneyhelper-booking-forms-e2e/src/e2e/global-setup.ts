import { createServer } from 'node:net';

import { startMockApi } from './mocks/mock-api';

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
  // check if the port is available before starting the server to provide a clearer error message if it's not
  const port = Number(process.env.MOCK_API_PORT ?? 4001);
  const isPortAvailable = await checkPort(port);
  if (!isPortAvailable) {
    console.error(
      `[global-setup] ❌ Port ${port} is not available. Please free the port and try again.`,
    );
    process.exit(1);
  }

  await startMockApi();
  // eslint-disable-next-line no-console
  console.info('[global-setup] ✅ Mock API server started');
}
