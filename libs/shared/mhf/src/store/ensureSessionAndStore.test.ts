import { IncomingMessage } from 'node:http';

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

  it.each([
    [
      'Fetch API Request',
      { headers: { get: () => null } } as unknown as Request,
    ],
    [
      'IncomingMessage',
      { headers: { cookie: null } } as unknown as IncomingMessage,
    ],
  ])('creates new session if no fsid cookie [%s]', async (_desc, req) => {
    const result = await ensureSessionAndStore(req, 'step-0');
    expect(result.key).toBe(mockUuid);
    expect(result.responseHeaders.get('Set-Cookie')).toContain(
      `fsid=${mockUuid}`,
    );
    expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
      data: {
        flow: '',
        lang: 'en',
      },
      errors: {},
      stepIndex: 0,
      steps: ['step-0'],
    });
  });

  it.each([
    [
      'Fetch API Request',
      { headers: { cookie: 'fsid=existing-key;' } } as unknown as Request,
    ],
    [
      'IncomingMessage',
      {
        headers: { cookie: 'fsid=existing-key;' },
      } as unknown as IncomingMessage,
    ],
  ])(
    'create a new session if forceNewSession is true [%s]',
    async (_desc, req) => {
      const result = await ensureSessionAndStore(
        req,
        'step-0',
        true,
        'mock-flow',
        'cy',
      );
      expect(result.key).toBe(mockUuid);
      expect(result.responseHeaders.get('Set-Cookie')).toContain(
        `fsid=${mockUuid}`,
      );
      expect(setStoreEntry).toHaveBeenCalledWith(mockUuid, {
        data: {
          flow: 'mock-flow',
          lang: 'cy',
        },
        errors: {},
        stepIndex: 0,
        steps: ['step-0'],
      });
    },
  );
});
