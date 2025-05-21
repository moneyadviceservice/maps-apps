import { NextApiRequest, NextApiResponse } from 'next';

import { EventEmitter } from 'events';
import { createRequest, createResponse } from 'node-mocks-http';
import { PassThrough } from 'stream';

import { dbConnect } from '../../lib/database/dbConnect';
import handler from '../../pages/api/export-organisations';

jest.mock('../../lib/database/dbConnect');

describe('GET /api/export-organisations', () => {
  it('streams CSV response successfully', async () => {
    const mockData = [
      { id: '1', name: 'Org One' },
      { id: '2', name: 'Org Two' },
    ];

    const asyncIterator = {
      async *[Symbol.asyncIterator]() {
        yield { resources: mockData };
      },
    };

    (dbConnect as jest.Mock).mockResolvedValue({
      container: {
        items: {
          query: jest.fn().mockReturnValue({
            getAsyncIterator: () => asyncIterator,
          }),
        },
      },
    });

    const req = createRequest({
      method: 'GET',
    });

    const res = createResponse({ eventEmitter: EventEmitter });

    const passthrough = new PassThrough();
    const chunks: Buffer[] = [];

    passthrough.on('data', (chunk) => chunks.push(chunk));
    passthrough.on('end', () => {
      const csvOutput = Buffer.concat(chunks).toString('utf-8');
      expect(csvOutput).toContain('id');
      expect(csvOutput).toContain('Org One');
      expect(csvOutput).toContain('Org Two');
    });

    res.setHeader = jest.fn();
    // @ts-expect-error - mocking pipe for stream
    res.pipe = passthrough;

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      expect.stringContaining('attachment; filename="organisations.csv"'),
    );
  });

  it('returns 405 for unsupported methods', async () => {
    const req = createRequest({ method: 'POST' });
    const res = createResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    });
  });
});
