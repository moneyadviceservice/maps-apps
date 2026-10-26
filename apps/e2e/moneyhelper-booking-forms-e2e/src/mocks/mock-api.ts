import express, { Express } from 'express';
import { Server as HttpServer } from 'node:http';
import { ENV } from '@mhbf-e2e/lib/env.lib';

let server: HttpServer | null = null;
export const app: Express = express();

app.disable('x-powered-by');
app.use(express.json());

/**
 * Starts the mock API server on the specified port.
 */
export function startMockApi(): Promise<HttpServer> {
  const port = ENV.MOCK_API_PORT;

  return new Promise((resolve, reject) => {
    // Return existing server instance if already running
    if (server?.listening) {
      return resolve(server);
    }

    const instance = app.listen(port, () => {
      console.info(`[mock-api] 💡 Listening on port ${port}`);
      server = instance;
      resolve(instance);
    });

    // Use .once to prevent duplicate error listener leaks
    instance.once('error', (error) => {
      console.error(
        `[mock-api] ❌ Failed to start on port ${port}:`,
        error.message,
      );
      reject(error);
    });
  });
}

/**
 * Stops the mock API server cleanly.
 */
export function stopMockApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!server) {
      return resolve();
    }

    // Force close active/idle connections to prevent teardown hangs
    if ('closeIdleConnections' in server) {
      server.closeIdleConnections();
    }

    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        server = null;
        resolve();
      }
    });
  });
}
