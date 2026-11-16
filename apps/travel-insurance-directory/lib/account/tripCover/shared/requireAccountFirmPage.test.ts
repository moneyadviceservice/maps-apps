jest.mock('lib/accountAuth/getAccountSession', () => ({
  getAccountSession: jest.fn(),
}));
jest.mock('lib/account/tripCover/shared/resolveAccountFirmById', () => ({
  resolveAccountFirmById: jest.fn(),
}));

import type { GetServerSidePropsContext } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import type { IronSessionObject } from 'types/iron-session';

import {
  loadAccountFirmForPage,
  requireAccountFirm,
  requireAccountSession,
  requireFirmIdParam,
} from './requireAccountFirmPage';
import { resolveAccountFirmById } from './resolveAccountFirmById';

const mockedGetAccountSession = getAccountSession as jest.MockedFunction<
  typeof getAccountSession
>;
const mockedResolveAccountFirmById =
  resolveAccountFirmById as jest.MockedFunction<typeof resolveAccountFirmById>;

const testSession = {
  isAccountAuthenticated: true,
  accountEmail: 'a@b.com',
} as IronSessionObject;

function testGsspContext(
  overrides: Pick<GetServerSidePropsContext, 'params' | 'query'>,
): GetServerSidePropsContext {
  return overrides as GetServerSidePropsContext;
}

describe('requireAccountFirmPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requireAccountSession redirects unauthenticated users', async () => {
    mockedGetAccountSession.mockResolvedValueOnce(null);

    const result = await requireAccountSession(
      testGsspContext({ params: {}, query: {} }),
    );

    expect(result).toEqual({
      type: 'redirect',
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    });
  });

  it('requireFirmIdParam rejects invalid params', () => {
    expect(requireFirmIdParam(undefined)).toBeNull();
    expect(requireFirmIdParam('  ')).toBeNull();
    expect(requireFirmIdParam('firm-123')).toBe('firm-123');
    expect(requireFirmIdParam(['firm-123'])).toBe('firm-123');
  });

  it('loadAccountFirmForPage reads firmId from query when params are missing', async () => {
    const firm = createMockFirm({ id: 'firm-123' });
    mockedGetAccountSession.mockResolvedValueOnce(testSession);
    mockedResolveAccountFirmById.mockResolvedValueOnce({
      firm,
      isTrading: false,
    });

    const result = await loadAccountFirmForPage(
      testGsspContext({ params: {}, query: { firmId: 'firm-123' } }),
      { from: 'params', key: 'firmId' },
    );

    expect(result).toEqual({
      type: 'ok',
      session: testSession,
      firmId: 'firm-123',
      resolved: {
        firm,
        isTrading: false,
      },
    });
  });

  it('requireAccountFirm returns notFound when firm cannot be resolved', async () => {
    mockedResolveAccountFirmById.mockResolvedValueOnce(null);

    const result = await requireAccountFirm(testSession, 'firm-123');

    expect(result).toEqual({ type: 'notFound' });
  });

  it('loadAccountFirmForPage returns notFound when firm cannot be resolved', async () => {
    mockedGetAccountSession.mockResolvedValueOnce(testSession);
    mockedResolveAccountFirmById.mockResolvedValueOnce(null);

    const result = await loadAccountFirmForPage(
      testGsspContext({ params: { firmId: 'firm-123' }, query: {} }),
      { from: 'params', key: 'firmId' },
    );

    expect(result).toEqual({ type: 'notFound' });
  });

  it('loadAccountFirmForPage allows optional query firmId', async () => {
    mockedGetAccountSession.mockResolvedValueOnce(testSession);

    const result = await loadAccountFirmForPage(
      testGsspContext({ params: {}, query: {} }),
      { from: 'query', key: 'firmId', optional: true },
    );

    expect(result).toEqual({
      type: 'ok',
      session: testSession,
      firmId: null,
      resolved: null,
    });
  });
});
