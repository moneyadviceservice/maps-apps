import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';
import { getStore } from '@netlify/blobs';

import { loadEnv } from '../loadEnv';
import { initialiseSession } from './initialiseSession';

jest.mock('cookies');
jest.mock('@netlify/blobs');
jest.mock('../loadEnv');

describe('initialiseSession', () => {
  const mockContext = {
    req: {},
    res: {},
  } as GetServerSidePropsContext;

  beforeEach(() => {
    // Mock crypto.randomUUID
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: jest.fn(() => 'mock-session-id'),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if req is missing', async () => {
    const invalidContext = {
      ...mockContext,
      req: undefined,
    } as unknown as GetServerSidePropsContext;

    await expect(initialiseSession(invalidContext)).rejects.toThrow(
      'Request and response objects are required',
    );
  });

  it('should throw an error if res is missing', async () => {
    const invalidContext = {
      ...mockContext,
      res: undefined,
    } as unknown as GetServerSidePropsContext;

    await expect(initialiseSession(invalidContext)).rejects.toThrow(
      'Request and response objects are required',
    );
  });

  it('should initialize a new session and store the record', async () => {
    const mockCookies = {
      set: jest.fn(),
    };
    const mockStore = {
      setJSON: jest.fn(),
      get: jest.fn(),
    };

    // Mock dependencies
    (Cookies as unknown as jest.Mock).mockImplementation(() => mockCookies);
    (getStore as jest.Mock).mockReturnValue(mockStore);
    (loadEnv as jest.Mock).mockReturnValue({
      name: 'test-store',
    });

    const now = new Date().toISOString();

    // Mock Date to ensure consistent metadata
    jest.spyOn(global, 'Date').mockImplementation(
      () =>
        ({
          toISOString: () => now,
        } as unknown as Date),
    );

    await initialiseSession(mockContext);

    // Assert that the session cookie is set
    expect(Cookies).toHaveBeenCalledWith(mockContext.req, mockContext.res);
    expect(mockCookies.set).toHaveBeenCalledWith('fsid', 'mock-session-id', {
      httpOnly: true,
      path: '/',
    });

    // Assert that the session record is stored
    expect(loadEnv).toHaveBeenCalled();
    expect(mockStore.setJSON).toHaveBeenCalledWith(
      'mock-session-id',
      { data: {}, errors: [] },
      { metadata: { createdAt: now } },
    );
  });
});
