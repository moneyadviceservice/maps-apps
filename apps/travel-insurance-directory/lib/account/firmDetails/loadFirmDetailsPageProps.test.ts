import type { GetServerSidePropsContext } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { loadRequiredAccountFirmParams } from 'lib/account/tripCover/shared';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

import { loadFirmDetailsPageProps } from './loadFirmDetailsPageProps';

jest.mock('lib/account/tripCover/shared', () => ({
  loadRequiredAccountFirmParams: jest.fn(),
}));
jest.mock('utils/helper/getCookieAndCleanUp', () => ({
  getCookieAndCleanUp: jest.fn(),
}));

const mockedLoadRequiredAccountFirmParams =
  loadRequiredAccountFirmParams as jest.MockedFunction<
    typeof loadRequiredAccountFirmParams
  >;
const mockedGetCookieAndCleanUp = getCookieAndCleanUp as jest.MockedFunction<
  typeof getCookieAndCleanUp
>;

function testGsspContext(
  overrides: Pick<GetServerSidePropsContext, 'params' | 'query'>,
): GetServerSidePropsContext {
  return overrides as GetServerSidePropsContext;
}

describe('loadFirmDetailsPageProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns firm props without trip-cover redirects', async () => {
    const firm = createMockFirm({ id: 'firm-123' });

    mockedLoadRequiredAccountFirmParams.mockResolvedValue({
      status: 'ok',
      firmId: 'firm-123',
      resolved: {
        firm,
        isTrading: false,
      },
    });
    mockedGetCookieAndCleanUp.mockReturnValue(null);

    const result = await loadFirmDetailsPageProps(
      testGsspContext({ params: {}, query: { firmId: 'firm-123' } }),
    );

    expect(result).toEqual({
      status: 'ok',
      props: {
        firmId: 'firm-123',
        initialValues: firm,
        initialErrors: null,
        isChangeAnswer: null,
      },
    });
  });

  it('returns notFound when the firm cannot be resolved', async () => {
    mockedLoadRequiredAccountFirmParams.mockResolvedValue({
      status: 'notFound',
    });

    const result = await loadFirmDetailsPageProps(
      testGsspContext({ params: {}, query: {} }),
    );

    expect(result).toEqual({ status: 'notFound' });
  });
});
