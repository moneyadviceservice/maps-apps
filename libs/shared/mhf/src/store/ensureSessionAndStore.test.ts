import { IncomingMessage } from 'node:http';

import { mockEntry, mockFlow, mockRouteFlow, mockSteps } from '../mocks';
import { setStoreEntry } from '../store';
import { ensureSessionAndStore } from './ensureSessionAndStore';

jest.mock('../store', () => ({
  setStoreEntry: jest.fn(),
}));
jest.mock('uuid', () => ({ v4: () => mockUuid }));

const mockUuid = 'mock-uuid';

describe('ensureSessionAndStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates new session if no fsid cookie (Fetch API Request)', async () => {
    const req = { headers: { get: () => null } } as unknown as Request;
    const result = await ensureSessionAndStore(req, mockFlow, mockRouteFlow);
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, mockEntry);
  });

  it('create a new session if forceNewSession is true', async () => {
    // Simulate a request with an existing fsid cookie
    const req = {
      headers: { cookie: 'fsid=existing-key;' },
    } as unknown as Request;
    const result = await ensureSessionAndStore(
      req,
      mockFlow,
      mockRouteFlow,
      2,
      true,
      'cy',
    );
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
      ...mockEntry,
      data: {
        flow: 'mock-flow',
        lang: 'cy',
      },
      steps: mockSteps,
      stepIndex: 2,
    });
  });
  it('throws an error if the flow is not defined in routeFlow map', async () => {
    const req = { headers: { cookie: null } } as unknown as IncomingMessage;
    await expect(
      ensureSessionAndStore(req, 'undefined-flow', mockRouteFlow),
    ).rejects.toThrow(
      '[ensureSessionAndStore] No flow configuration found for flow: undefined-flow',
    );
  });

  it('returns existing session key from Fetch API Request cookie', async () => {
    const existingKey = 'existing-session-id';
    const req = {
      headers: { get: () => `fsid=${existingKey}; other=value` },
    } as unknown as Request;
    const result = await ensureSessionAndStore(req, mockFlow, mockRouteFlow);
    expect(result.key).toBe(existingKey);
    expect(result.responseHeaders.get('Set-Cookie')).toBeNull();
    expect(setStoreEntry).not.toHaveBeenCalled();
  });

  it('returns existing session key from IncomingMessage cookie', async () => {
    const existingKey = 'existing-session-id';
    const req = {
      headers: { cookie: `fsid=${existingKey}; other=value` },
    } as unknown as IncomingMessage;
    const result = await ensureSessionAndStore(req, mockFlow, mockRouteFlow);
    expect(result.key).toBe(existingKey);
    expect(result.responseHeaders.get('Set-Cookie')).toBeNull();
    expect(setStoreEntry).not.toHaveBeenCalled();
  });
});
