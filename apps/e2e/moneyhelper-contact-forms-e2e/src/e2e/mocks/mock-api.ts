import express = require('express');
import { Request, Response } from 'express';
import isEqual from 'lodash/isEqual';
import { Server as HttpServer } from 'node:http';

import { EXPECTED_CASE_REFS, mockSuccessPayloads } from './mock-data';

let server: HttpServer;
const app = express();
app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security reasons
const port = Number(process.env.MOCK_API_PORT ?? 4001);
const mockPath = process.env.MOCK_API_PATH ?? '/mockEndPoint';

// API call counter and last POST start timestamp
let apiCallCount = 0;
let lastPostStartedAt: number | null = null;
let delayMs: number | null = null;

app.use(express.json());

/**
 * POST endpoint to handle mock API requests. It checks if the incoming request body matches any of the predefined mock success payloads. (see mock-data.ts) If a match is found, it simulates a successful response with a case reference. If no match is found, it returns a 400 error. A conditional artificial delay can be applied to simulate slow API responses, which is useful for testing stale submission handling in the submit flow tests.
 */
app.post(mockPath, async (request: Request, response: Response) => {
  lastPostStartedAt = Date.now();
  const mock = mockSuccessPayloads.find((payload) =>
    isEqual(request.body, payload),
  );

  // Apply an artificial delay if set (used for tests in submitFlow.spec.ts)
  if (delayMs && delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    delayMs = null;
  }

  if (mock) {
    apiCallCount++;
    const kindofEnquiry = (mock.kindofEnquiry as number | undefined) ?? 0;
    const caseRef = EXPECTED_CASE_REFS[kindofEnquiry];
    return response.status(200).json({ status: true, message: caseRef });
  }

  return response.status(400).json({ status: false, message: 100 });
});

// GET endpoint to set the next POST delay (for stale journey testing)
app.get(`${mockPath}/set-delay/:ms`, (req: Request, res: Response) => {
  const msParam = Array.isArray(req.params.ms)
    ? req.params.ms[0]
    : req.params.ms;
  const ms = Number.parseInt(msParam, 10);
  if (!Number.isNaN(ms) && ms > 0) {
    delayMs = ms;
    res.json({ ok: true, delay: ms });
  } else {
    delayMs = null;
    res.status(400).json({ ok: false, error: 'Invalid delay' });
  }
});

// GET endpoint to return API call count - used in submitFlow.spec.ts to verify retry logic
app.get(`${mockPath}/count`, (_req: Request, response: Response) => {
  response.json({ count: apiCallCount });
});

// GET endpoint to return last POST started timestamp - used in submitFlow.spec.ts to verify retry timing
app.get(`${mockPath}/last-started`, (_req: Request, response: Response) => {
  response.json({ lastPostStartedAt });
});

// GET endpoint to reset API call count and last started timestamp - used submitFlow.spec.ts to reset state between tests
app.get(`${mockPath}/reset`, (_req: Request, response: Response) => {
  resetApiCallCount();
  response.json({ ok: true });
});

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

/**
 * Resets the API call count and last POST started timestamp. This is used in tests to ensure a clean state before each test case runs.
 */
export function resetApiCallCount() {
  apiCallCount = 0;
  lastPostStartedAt = null;
}
