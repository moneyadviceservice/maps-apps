/* eslint-disable no-restricted-properties */
import { createServer } from 'node:net';
import { startMockApi } from '@lib/mock-api.lib';

/**
 * This file needs to run before we start the tests and webserver.
 *
 * The reason for this is that the application under test is set to look at
 * and API endpoint to get booking slots, it'll try make a request to:
 *
 * APPOINTMENTS_API:PORT/GetBookingSlots
 *
 * When it does that, it will populate booking slots on the frontend
 * with the returned data.
 *
 * The purpose of this setup is to create a mock server and
 * change the APPOINTMENTS_API to look at that server,
 * which will return static data to ensure our tests are robust.
 *
 * The chronological process is:
 *
 * - Run playwright
 * - Start the mock server
 * - Change appointments API environment variables to the mock servers
 * - Run the web server
 * - Run the tests
 */

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

/**
 * Set the appointments API url to use the mock API server.
 */
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

  await startMockApi(Number(port));

  console.info(
    `[global-setup] ✅  Mock API server on ${process.env.APPOINTMENTS_API}`,
  );
}
