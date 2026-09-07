import { GetServerSidePropsContext } from 'next';

import { areTripCoversComplete } from 'lib/account/firmSectionStatus';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import {
  getFirstIncompleteStepPath,
  getLastStepPath,
} from 'lib/account/tripCover/steps';
import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

import { withSelfServeServerSideProps } from './withSelfServeServerSideProps';

jest.mock('lib/accountAuth/getAccountSession');
jest.mock('utils/helper/getCookieAndCleanUp');
jest.mock('lib/account/tripCover/shared/resolveAccountFirmById');
jest.mock('lib/account/firmSectionStatus');
jest.mock('lib/account/tripCover/steps');

const mockGetIronSession = jest.fn();

jest.mock('iron-session', () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

const mockContainer = {};
const mockDatabase = {
  container: jest.fn().mockReturnValue(mockContainer),
};
const mockClient = {
  database: jest.fn().mockReturnValue(mockDatabase),
};

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => mockClient),
}));

const mockContext: Partial<GetServerSidePropsContext> = {
  query: {},
};

describe('withSelfServeServerSideProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when no session', async () => {
    (getAccountSession as jest.Mock).mockResolvedValue(null);

    const result = await withSelfServeServerSideProps(
      mockContext as GetServerSidePropsContext,
    );

    expect(result).toEqual({
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
      props: {},
    });
  });

  it('returns props when no firmId', async () => {
    (getAccountSession as jest.Mock).mockResolvedValue({ db_id: 'firm-1' });
    (getCookieAndCleanUp as jest.Mock).mockReturnValue({
      fields: { some: 'error' },
    });
    (resolveAccountFirmById as jest.Mock).mockResolvedValue({
      firm: { id: 'firm-1', type: 'main' },
    });

    const result = await withSelfServeServerSideProps(
      mockContext as GetServerSidePropsContext,
    );

    expect(resolveAccountFirmById).toHaveBeenCalledWith(
      { db_id: 'firm-1' },
      'firm-1',
    );
    expect(result).toEqual(
      expect.objectContaining({
        props: {
          initialErrors: { some: 'error' },
          initialValues: { id: 'firm-1', type: 'main' },
          firmId: null,
          backLink: '/account',
          isChangeAnswer: null,
        },
      }),
    );
  });

  it('returns notFound when firmId cannot be resolved', async () => {
    (getAccountSession as jest.Mock).mockResolvedValue({ db_id: 1 });
    mockContext.query = { firmId: '123' };

    (resolveAccountFirmById as jest.Mock).mockResolvedValue(null);

    const result = await withSelfServeServerSideProps(
      mockContext as GetServerSidePropsContext,
    );

    expect(result).toEqual({ notFound: true });
  });

  it('redirects to first incomplete step when trip covers incomplete', async () => {
    (getAccountSession as jest.Mock).mockResolvedValue({ db_id: 1 });

    mockContext.query = { firmId: '123' };

    (resolveAccountFirmById as jest.Mock).mockResolvedValue({
      firm: { trip_covers: [{}] },
    });

    (areTripCoversComplete as jest.Mock).mockReturnValue(false);
    (getFirstIncompleteStepPath as jest.Mock).mockReturnValue(
      '/account/step-1',
    );

    const result = await withSelfServeServerSideProps(
      mockContext as GetServerSidePropsContext,
    );

    expect(result).toEqual({
      redirect: {
        destination: '/account/step-1',
        permanent: false,
      },
    });
  });

  it('returns props with backLink when firmId exists and complete', async () => {
    (getAccountSession as jest.Mock).mockResolvedValue({ db_id: 'firm-1' });

    mockContext.query = { firmId: '123' };

    (resolveAccountFirmById as jest.Mock).mockResolvedValue({
      firm: { id: '123', type: 'main', trip_covers: [] },
    });

    (areTripCoversComplete as jest.Mock).mockReturnValue(true);
    (getLastStepPath as jest.Mock).mockReturnValue('/account/last');

    (getCookieAndCleanUp as jest.Mock).mockReturnValue({
      fields: {},
    });

    const result = await withSelfServeServerSideProps(
      mockContext as GetServerSidePropsContext,
    );

    expect(resolveAccountFirmById).toHaveBeenCalledWith(
      { db_id: 'firm-1' },
      '123',
    );

    expect(result).toEqual(
      expect.objectContaining({
        props: {
          firmId: '123',
          backLink: '/account/last',
          initialErrors: {},
          initialValues: { id: '123', type: 'main', trip_covers: [] },
          isChangeAnswer: null,
        },
      }),
    );
  });

  it('returns trading firm initialValues when firmId is a trading document', async () => {
    (getAccountSession as jest.Mock).mockResolvedValue({ db_id: 'main-1' });
    mockContext.query = { firmId: 'trading-1' };

    (resolveAccountFirmById as jest.Mock).mockResolvedValue({
      firm: { id: 'trading-1', type: 'trading', trip_covers: [] },
    });
    (areTripCoversComplete as jest.Mock).mockReturnValue(true);
    (getLastStepPath as jest.Mock).mockReturnValue('/account/last');
    (getCookieAndCleanUp as jest.Mock).mockReturnValue({ fields: {} });

    const result = await withSelfServeServerSideProps(
      mockContext as GetServerSidePropsContext,
    );

    expect(result).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          initialValues: { id: 'trading-1', type: 'trading', trip_covers: [] },
        }),
      }),
    );
  });
});
