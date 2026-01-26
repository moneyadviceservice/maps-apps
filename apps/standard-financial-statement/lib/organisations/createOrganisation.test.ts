import { FormFlowType } from 'data/form-data/org_signup';

import { Entry } from '../../lib/types';
import { Organisation } from '../../types/Organisations';
import { dbConnect } from '../database/dbConnect';
import { createOrganisation } from './createOrganisation';

jest.mock('../database/dbConnect');
const mockDbConnect = dbConnect as jest.Mock;

type MockContainerOptions = {
  resources?: any;
  error?: any;
};

function createMockContainer(options: MockContainerOptions = {}) {
  return {
    items: {
      create: jest.fn().mockImplementation(async () => {
        if (options.error) {
          throw options.error;
        }
        return { resource: options.resources };
      }),
      query: jest.fn().mockReturnValue({
        fetchAll: jest.fn().mockResolvedValue({
          resources: [
            {
              id: '1',
              licence_number: 123,
              name: 'Test Org',
              type: { title: 'Charity' },
              licence_status: 'Pending',
              sfs_live: true,
              created: new Date().toISOString(),
              modified: new Date().toISOString(),
            },
          ],
        }),
      }),
    },
  };
}
describe('createOrganisation', () => {
  const entry: Entry = {
    data: {
      lang: 'en',
      flow: 'new' as FormFlowType,
      organisationName: 'ORG name',
      organisationStreet: 'STREEt name',
      organisationCity: 'LONDON',
      organisationPostcode: 'sw1v3da',
      organisationType: 'Free-to-client advice services provider',
      geoRegions: ['yorkshire-and-the-humber', 'east-of-england'],
      organisationUse: 'provide-debt-advice',
      debtAdvice: ['face-to-face'],
      sfslive: 'false',
      sfsLaunchDate: '2025-05-29',
      caseManagementSoftware: '',
      fcaReg: 'fca-no',
      memberships: ['advice-ni'],
      'advice-ni': '1234',
    },
    errors: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an organisation with fca', async () => {
    const data = {
      ...entry.data,
      fca: {
        fca_number: '12345',
        fca_registered: 'fca-yes',
      },
    } as Organisation;

    mockDbConnect.mockResolvedValue({
      container: createMockContainer({
        resources: data as unknown as Organisation,
      }),
    });

    const result = await createOrganisation(entry, 'test@test.com');
    expect(result).toEqual({
      success: true,
      response: data,
    });
  });

  it('should create an organisation', async () => {
    const mockContainer = createMockContainer({
      resources: entry.data as Organisation,
    });

    mockDbConnect.mockResolvedValue({ container: mockContainer });

    const result = await createOrganisation(entry, 'test@test.com');
    expect(result).toEqual({
      success: true,
      response: entry.data,
    });
  });

  it('should handle errors when creating an organisation', async () => {
    const mockError = new Error('Database error');
    const mockContainer = createMockContainer({ error: mockError });

    mockDbConnect.mockResolvedValue({ container: mockContainer });

    const result = await createOrganisation(entry, 'test@test.com');
    expect(result).toEqual({ error: 'Failed to create organisation' });
  });
});
