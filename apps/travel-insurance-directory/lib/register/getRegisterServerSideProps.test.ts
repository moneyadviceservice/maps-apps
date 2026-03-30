import { GetServerSidePropsContext } from 'next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { FormErrorsState } from 'components/Register/Register';
import { getIronSession } from 'iron-session';
import { fetchFirm } from 'lib/firms/fetchFirm';
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
jest.mock('lib/firms/fetchFirm');
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

  it('should return basic props when no session db_id exists', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({});
    (getCookieAndCleanUp as jest.Mock).mockReturnValue(null);

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
    (fetchFirm as jest.Mock).mockResolvedValue({ response: mockFirmResponse });
    (getCookieAndCleanUp as jest.Mock).mockReturnValue(null);

    const gSSP = getRegisterServerSideProps(false);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(fetchFirm).toHaveBeenCalledWith('db_123');
    expect(result.props.initialValues).toEqual(mockFirmResponse);
  });

  it('should return only specific_conditions when isScenario is true', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (fetchFirm as jest.Mock).mockResolvedValue({ response: mockFirmResponse });
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
    (getIronSession as jest.Mock).mockResolvedValue({});
    (getCookieAndCleanUp as jest.Mock).mockReturnValue({
      fields: { someField: 'Invalid input' },
    });

    const gSSP = getRegisterServerSideProps(false);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(result.props.initialErrors).toEqual({ someField: 'Invalid input' });
  });

  it('should handle fetchFirm failure gracefully', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ db_id: 'db_123' });
    (fetchFirm as jest.Mock).mockResolvedValue({
      response: null,
      error: 'Failed',
    });

    const gSSP = getRegisterServerSideProps(false);
    const result = (await gSSP(mockContext as GetServerSidePropsContext)) as {
      props: RegisterProps;
    };

    expect(result.props.initialValues).toBeNull();
  });
});
