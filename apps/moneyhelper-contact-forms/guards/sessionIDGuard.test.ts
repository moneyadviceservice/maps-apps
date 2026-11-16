import { GetServerSidePropsContext } from 'next';

import { mockEntry, mockSessionId } from '@maps-react/mhf/mocks';
import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import { Entry } from '@maps-react/mhf/types';
import { getSessionId } from '@maps-react/mhf/utils/';

import { sessionIDGuard } from './sessionIDGuard';

jest.mock('@maps-react/mhf/store', () => ({
  getStoreEntry: jest.fn(),
  setStoreEntry: jest.fn(),
}));

jest.mock('@maps-react/mhf/utils/', () => {
  const actual = jest.requireActual('@maps-react/mhf/utils/');
  return {
    ...actual,
    getSessionId: jest.fn(),
  };
});

const mockGuid = '550e8400-e29b-41d4-a716-446655440000';
let existingEntry: Entry;
let context: GetServerSidePropsContext;

const buildContext = (
  query: Record<string, string | string[] | undefined>,
  resolvedUrl = '/en/about-mhpd',
) =>
  ({
    query,
    resolvedUrl,
    res: {
      writeHead: jest.fn(),
      end: jest.fn(),
    },
  } as unknown as GetServerSidePropsContext);

describe('sessionIDGuard', () => {
  beforeEach(() => {
    existingEntry = { ...mockEntry, data: { ...mockEntry.data } };
    (getSessionId as jest.Mock).mockReturnValueOnce(mockSessionId);

    context = buildContext({ sessionID: mockGuid });
  });

  afterEach(() => {
    jest.clearAllMocks();
    (getSessionId as jest.Mock).mockReset();
    (getStoreEntry as jest.Mock).mockReset();
    (setStoreEntry as jest.Mock).mockReset();
  });

  it('exits early if sessionID is not present in query', async () => {
    context = buildContext({});
    await sessionIDGuard(context);
    expect(getSessionId).not.toHaveBeenCalled();
  });

  it('exits early if sessionID is not a valid GUID', async () => {
    context = buildContext({ sessionID: 'invalid-guid' });
    await sessionIDGuard(context);
    expect(getSessionId).not.toHaveBeenCalled();
  });

  it('exits early if session key cannot be retrieved', async () => {
    (getSessionId as jest.Mock).mockReset();
    (getSessionId as jest.Mock).mockReturnValueOnce(null);
    await sessionIDGuard(context);
    expect(getStoreEntry).not.toHaveBeenCalled();
  });

  it('exits early if no store entry exists for session key', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValueOnce(null);
    await sessionIDGuard(context);
    expect(setStoreEntry).not.toHaveBeenCalled();
  });

  it('stores sessionID in session store if not already stored', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValueOnce(existingEntry);
    await sessionIDGuard(context);
    expect(setStoreEntry).toHaveBeenCalledWith(mockSessionId, {
      ...existingEntry,
      data: {
        ...existingEntry.data,
        sessionID: mockGuid,
      },
    });
  });

  it('stores sessionID if not already present and sessionID is an array', async () => {
    (getStoreEntry as jest.Mock).mockResolvedValueOnce(existingEntry);
    const context = buildContext({ sessionID: [mockGuid] });
    await sessionIDGuard(context);
    expect(setStoreEntry).toHaveBeenCalledWith(mockSessionId, {
      ...existingEntry,
      data: {
        ...existingEntry.data,
        sessionID: mockGuid,
      },
    });
  });

  it('does not overwrite existing sessionID in session store', async () => {
    existingEntry.data.sessionID = 'existing-session-id';
    (getStoreEntry as jest.Mock).mockResolvedValueOnce(existingEntry);
    await sessionIDGuard(context);
    expect(setStoreEntry).not.toHaveBeenCalled();
  });
});
