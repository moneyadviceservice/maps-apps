import { GetServerSidePropsContext } from 'next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { getIronSession } from 'iron-session';
import { resolveRegisterFirm } from 'lib/register/resolveRegisterFirm';
import { FormErrorsState } from 'types/register';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

import { getRegisterServerSideProps } from './getRegisterServerSideProps';

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

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));
jest.mock('lib/register/resolveRegisterFirm');
jest.mock('utils/helper/getCookieAndCleanUp');
jest.mock('@azure/cosmos');

interface RegisterProps {
  step: string | string[] | undefined;
  isChangeAnswer: boolean;
  initialValues: Record<string, string> | null;
  initialErrors: FormErrorsState | null;
}

describe('getRegisterServerSideProps', () => {
  let mockContext: Partial<GetServerSidePropsContext>;

  const mockFirmResponse = {
    type: 'main' as const,
    id: '123',
    registered_name: 'Test Firm',
    medical_coverage: {
      specific_conditions: {
        hiv: 'yes',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockContext = {
      req: {} as NextApiRequest,
      res: {} as NextApiResponse,
      query: { step: 'step1' },
    };
  });

  it('redirects when session has no firm id', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({});

    const gSSP = getRegisterServerSideProps(false);
    const result = await gSSP(mockContext as GetServerSidePropsContext);

    expect(result).toEqual({
      redirect: { destination: '/register/fca', permanent: false },
    });
  });

  it('redirects to user step when fca data exists but firm id is missing', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({
      fcaData: { frnNumber: '123456', firmName: 'Test' },
    });

    const gSSP = getRegisterServerSideProps(false);
    const result = await gSSP(mockContext as GetServerSidePropsContext);

    expect(result).toEqual({
      redirect: { destination: '/register/user', permanent: false },
    });
  });

  it('should return basic props when firm session exists', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (getCookieAndCleanUp as jest.Mock).mockReturnValue(null);
    (resolveRegisterFirm as jest.Mock).mockResolvedValue(null);

    const gSSP = getRegisterServerSideProps(false);
    const result = await gSSP(mockContext as GetServerSidePropsContext);

    expect(result).toEqual({
      props: {
        step: 'step1',
        initialValues: null,
        initialErrors: null,
        isChangeAnswer: false,
      },
    });
  });

  it('should return full firm data when isScenario is false', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (resolveRegisterFirm as jest.Mock).mockResolvedValue(mockFirmResponse);
    (getCookieAndCleanUp as jest.Mock).mockReturnValue(null);

    const gSSP = getRegisterServerSideProps(false);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(resolveRegisterFirm).toHaveBeenCalledWith({ db_id: 'db_123' });
    expect(result.props.initialValues).toEqual(mockFirmResponse);
  });

  it('should return only specific_conditions when isScenario is true', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (resolveRegisterFirm as jest.Mock).mockResolvedValue(mockFirmResponse);
    (getCookieAndCleanUp as jest.Mock).mockReturnValue(null);

    const gSSP = getRegisterServerSideProps(true);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(result.props.initialValues).toEqual(
      mockFirmResponse.medical_coverage.specific_conditions,
    );
  });

  it('should include initialErrors if the error cookie exists', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (getCookieAndCleanUp as jest.Mock).mockReturnValue({
      fields: { someField: 'Invalid input' },
    });

    const gSSP = getRegisterServerSideProps(false);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(result.props.initialErrors).toEqual({ someField: 'Invalid input' });
  });

  it('should handle firm resolve failure gracefully', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (resolveRegisterFirm as jest.Mock).mockResolvedValue(null);

    const gSSP = getRegisterServerSideProps(false);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(result.props.initialValues).toBeNull();
  });
});
