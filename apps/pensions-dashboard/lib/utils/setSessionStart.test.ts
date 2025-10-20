import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

import Cookies from 'cookies';

import {
  getMhpdSessionConfig,
  MhpdSessionConfig,
  updateSessionConfigField,
} from './sessionConfig';
import { setSessionStart } from './setSessionStart';

// Mock the dependencies
jest.mock('cookies');
jest.mock('./sessionConfig');

const mockGetMhpdSessionConfig = getMhpdSessionConfig as jest.MockedFunction<
  typeof getMhpdSessionConfig
>;
const mockUpdateSessionConfigField =
  updateSessionConfigField as jest.MockedFunction<
    typeof updateSessionConfigField
  >;
const mockCookies = Cookies as jest.MockedClass<typeof Cookies>;

describe('setSessionStart', () => {
  let mockReq: NextApiRequest;
  let mockRes: NextApiResponse;
  let mockCookiesInstance: jest.Mocked<Cookies>;
  const mockNow = 1000000000;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(mockNow);

    mockReq = {} as NextApiRequest;
    mockRes = {} as NextApiResponse;

    mockCookiesInstance = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<Cookies>;

    mockCookies.mockReturnValue(mockCookiesInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each`
    description                                                  | sessionStart | shouldUpdate
    ${'should set sessionStart when it does not exist'}          | ${undefined} | ${true}
    ${'should set sessionStart when it is empty string'}         | ${''}        | ${true}
    ${'should not set sessionStart when it already has a value'} | ${'12345'}   | ${false}
  `('$description', ({ sessionStart, shouldUpdate }) => {
    const mockContext = {
      req: mockReq,
      res: mockRes,
    } as unknown as GetServerSidePropsContext;

    const mockSessionConfig: Partial<MhpdSessionConfig> = { sessionStart };
    mockGetMhpdSessionConfig.mockReturnValue(
      mockSessionConfig as MhpdSessionConfig,
    );

    setSessionStart(mockContext);

    expect(mockCookies).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockGetMhpdSessionConfig).toHaveBeenCalledWith(mockCookiesInstance);

    if (shouldUpdate) {
      expect(mockUpdateSessionConfigField).toHaveBeenCalledWith(
        mockCookiesInstance,
        'sessionStart',
        mockNow.toString(),
      );
    } else {
      expect(mockUpdateSessionConfigField).not.toHaveBeenCalled();
    }
  });

  test('should work with API route context', () => {
    const apiContext = { req: mockReq, res: mockRes };
    const mockSessionConfig: Partial<MhpdSessionConfig> = { sessionStart: '' };
    mockGetMhpdSessionConfig.mockReturnValue(
      mockSessionConfig as MhpdSessionConfig,
    );

    setSessionStart(apiContext);

    expect(mockCookies).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockGetMhpdSessionConfig).toHaveBeenCalledWith(mockCookiesInstance);
    expect(mockUpdateSessionConfigField).toHaveBeenCalledWith(
      mockCookiesInstance,
      'sessionStart',
      mockNow.toString(),
    );
  });

  test('should work with GetServerSideProps context', () => {
    const gssPContext = {
      req: mockReq,
      res: mockRes,
      query: {},
      resolvedUrl: '/test',
    } as unknown as GetServerSidePropsContext;

    const mockSessionConfig: Partial<MhpdSessionConfig> = {
      sessionStart: undefined,
    };
    mockGetMhpdSessionConfig.mockReturnValue(
      mockSessionConfig as MhpdSessionConfig,
    );

    setSessionStart(gssPContext);

    expect(mockCookies).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockGetMhpdSessionConfig).toHaveBeenCalledWith(mockCookiesInstance);
    expect(mockUpdateSessionConfigField).toHaveBeenCalledWith(
      mockCookiesInstance,
      'sessionStart',
      mockNow.toString(),
    );
  });
});
