import { organisationFormObject } from './organisationFormObject';
import { formatKeyTitleArrays } from '../formatKeyTitleArrays';
import { formatOrganisationMembership } from '../formatOrganisationMembership';
import { formatOrganisationType } from '../formatOrganisationType';

jest.mock('../formatKeyTitleArrays');
jest.mock('../formatOrganisationMembership');
jest.mock('../formatOrganisationType');

describe('organisationFormObject', () => {
  const mockFormData = {
    get: jest.fn((key: string) => {
      const data: Record<string, string> = {
        name: 'Org Name',
        email: 'test@example.com',
        address: '123 Main St',
        fca_registered: 'true',
        fca_number: '123456',
        launch_date: '2024-01-01',
        management_software_used: 'Software X',
        intended_use: 'Use Case A',
        other_use: 'Other Use X',
        website: 'https://example.com',
      };
      return data[key] ?? '';
    }),
  } as unknown as FormData;

  beforeEach(() => {
    jest.clearAllMocks();

    (formatKeyTitleArrays as jest.Mock).mockImplementation((_fd, list) =>
      list.map((item) => ({ key: item, title: `Title of ${item}` })),
    );

    (formatOrganisationType as jest.Mock).mockReturnValue({
      title: 'Mock Type',
    });

    (formatOrganisationMembership as jest.Mock).mockReturnValue([
      { key: 'org1', title: 'Org 1' },
    ]);
  });

  it('should return a correctly formatted payload', () => {
    const result = organisationFormObject(mockFormData);

    expect(formatKeyTitleArrays).toHaveBeenCalledTimes(2);
    expect(formatOrganisationType).toHaveBeenCalledTimes(1);
    expect(formatOrganisationMembership).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      name: 'Org Name',
      email: 'test@example.com',
      address: '123 Main St',
      geo_regions: expect.any(Array),
      delivery_channel: expect.any(Array),
      type: { title: 'Mock Type' },
      fca: {
        fca_registered: 'true',
        fca_number: '123456',
      },
      organisation_membership: [{ key: 'org1', title: 'Org 1' }],
      usage: {
        launch_date: '2024-01-01',
        management_software_used: 'Software X',
        intended_use: 'Use Case A',
        other_use: 'Other Use X',
      },
      website: 'https://example.com',
    });
  });

  it('should handle missing optional values gracefully', () => {
    const partialFormData = {
      get: jest.fn(() => null),
    } as unknown as FormData;

    (formatKeyTitleArrays as jest.Mock).mockReturnValue(undefined);
    (formatOrganisationType as jest.Mock).mockReturnValue(undefined);
    (formatOrganisationMembership as jest.Mock).mockReturnValue(undefined);

    const result = organisationFormObject(partialFormData);

    expect(result).toEqual({
      name: 'null',
      email: 'null',
      address: 'null',
      geo_regions: [],
      delivery_channel: [],
      type: { title: '' },
      fca: {
        fca_registered: 'null',
        fca_number: 'null',
      },
      organisation_membership: undefined,
      usage: {
        launch_date: 'null',
        management_software_used: 'null',
        intended_use: 'null',
        other_use: 'null',
      },
      website: 'null',
    });
  });
});
