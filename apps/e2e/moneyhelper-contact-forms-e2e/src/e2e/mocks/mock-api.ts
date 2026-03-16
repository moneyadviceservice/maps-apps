import express = require('express');
import { Request, Response } from 'express';
import isEqual from 'lodash/isEqual';
import { Server as HttpServer } from 'node:http';

import { EXPECTED_CASE_REFS, mockSuccessPayloads } from './mock-data';

let server: HttpServer;
const app = express();
app.disable('x-powered-by');
const port = Number(process.env.MOCK_API_PORT ?? 4001);
const mockPath = process.env.MOCK_API_PATH ?? '/mockEndPoint';

app.use(express.json());

/**
 * Matches incoming request payloads to predefined mock payloads based on the kindofEnquiry value
 * Returns appropriate responses for testing.
 */
app.post(mockPath, (req: Request, res: Response) => {
  const mock = mockSuccessPayloads.find((payload) =>
    isEqual(req.body, payload),
  );

  if (mock) {
    const kindofEnquiry = (mock.kindofEnquiry as number | undefined) ?? 0;
    const caseRef = EXPECTED_CASE_REFS[kindofEnquiry];
    console.info(
      `[mock-api] ✅ Matched payload for kindofEnquiry ${kindofEnquiry}`,
    );
    return res.status(200).json({ status: true, message: caseRef });
  }

  console.error('[mock-api] ❌ No matching payload found');
  return res.status(400).json({ status: false, message: 100 });
});

/**
 * Starts the mock API server on the specified port and resolves with the server instance once it's listening.
 * @returns
 */
export function startMockApi() {
  return new Promise<HttpServer>((resolve, reject) => {
    server = app.listen(port, () => {
      console.info(`[mock-api] 💡 Listening on port ${port}`);
      resolve(server);
    });
    server.on('error', (err) => {
      console.error(
        `[mock-api] ❌ Failed to start on port ${port}:`,
        err.message,
      );
      reject(err);
    });
  });
}

/**
 * Stops the mock API server.
 * @returns
 */
export function stopMockApi() {
  return new Promise<void>((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}
