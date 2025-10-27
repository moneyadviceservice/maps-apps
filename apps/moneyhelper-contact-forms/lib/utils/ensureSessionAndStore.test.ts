import { IncomingMessage } from 'http';

import { setStoreEntry } from '../../store';
import { ensureSessionAndStore } from './ensureSessionAndStore';

jest.mock('../../store', () => ({
  setStoreEntry: jest.fn(),
}));

const mockUuid = 'mock-uuid';
jest.mock('uuid', () => ({ v4: () => mockUuid }));

describe('ensureSessionAndStore', () => {
  it('returns existing session key from cookie (Node.js IncomingMessage)', async () => {
    const req = {
      headers: { cookie: 'fsid=existing-key;' },
    } as IncomingMessage;
    const result = await ensureSessionAndStore(req, 'test-flow', 2);
    expect(result.key).toBe('existing-key');
    expect(result.responseHeaders.get('Set-Cookie')).toBeNull();
  });

  it('returns existing session key from cookie (Fetch API Request)', async () => {
    const req = {
      headers: {
        get: () => 'fsid=existing-key;',
      },
    } as unknown as Request;
    const result = await ensureSessionAndStore(req, 'test-flow', 2);
    expect(result.key).toBe('existing-key');
    expect(result.responseHeaders.get('Set-Cookie')).toBeNull();
  });

  it('creates new session if no fsid cookie (Node.js IncomingMessage)', async () => {
    const req = { headers: { cookie: null } } as unknown as IncomingMessage;
    const result = await ensureSessionAndStore(req, 'test-flow', 1);
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
      data: {
        flow: 'test-flow',
        lang: 'en',
      },
      stepIndex: 1,
      errors: {},
    });
  });

  it('creates new session if no fsid cookie (Fetch API Request)', async () => {
    const req = { headers: { get: () => null } } as unknown as Request;
    const result = await ensureSessionAndStore(req, 'fetch-flow', 4);
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
      data: {
        flow: 'fetch-flow',
        lang: 'en',
      },
      stepIndex: 4,
      errors: {},
    });
  });
  it('creates new session with default flow and default step index if no parameters are provided', async () => {
    const req = { headers: { cookie: null } } as unknown as IncomingMessage;
    const result = await ensureSessionAndStore(req);
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
      data: {
        flow: 'money-management',
        lang: 'en',
      },
      stepIndex: 0,
      errors: {},
    });
  });

  it('creates new session if req has no headers property at all', async () => {
    // Simulate a request object with no headers property
    const req = {} as unknown as IncomingMessage;
    const result = await ensureSessionAndStore(req, 'no-headers-flow', 5);
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
      data: {
        flow: 'no-headers-flow',
        lang: 'en',
      },
      stepIndex: 5,
      errors: {},
    });
  });
});
