import express = require('express');
import { Server as HttpServer } from 'node:http';

let server: HttpServer;
const app = express();
app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security reasons
const port = Number(process.env.MOCK_API_PORT ?? 4001);

app.use(express.json());

/**
 * Starts the mock API server on the specified port and resolves with the server instance once it's listening.
 */
export function startMockApi() {
  return new Promise<HttpServer>((resolve, reject) => {
    server = app.listen(port, () => {
      console.info(`[mock-api] 💡 Listening on port ${port}`);
      resolve(server);
    });
    server.on('error', (error) => {
      console.error(
        `[mock-api] ❌ Failed to start on port ${port}:`,
        error.message,
      );
      reject(error);
    });
  });
}

/**
 * Stops the mock API server.
 */
export function stopMockApi() {
  return new Promise<void>((resolve, reject) => {
    if (server) {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}
