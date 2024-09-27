import { transformPensionData } from './transformPensionData';
import { MatchType, PensionType, UsageType } from '../constants';
import { PensionArrangement } from '../types';

/**
 * Generates mock pension data.
 *
 * @param contactMethods - An array of contact methods.
 * @returns A PensionArrangement object representing mock pension data.
 */
const getMockPensionData = (contactMethods: any[]): PensionArrangement => {
  return {
    pensionAdministrator: {
      contactMethods,
      name: '',
    },
    externalPensionPolicyId: '',
    externalAssetId: '',
    matchType: MatchType.DEFN,
    schemeName: '',
    contactReference: '',
    pensionType: PensionType.AVC,
    contributionsFromMultipleEmployers: false,
  };
};

describe('transformPensionData', () => {
  it('should sort and transform contact methods correctly', () => {
    const contactMethods = [
      {
        preferred: true,
        contactMethodDetails: {
          email: 'example@example.com',
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          number: '1234567890',
          usage: [UsageType.M, UsageType.S],
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          postalName: 'John Doe',
          countryCode: 'GB',
          line1: '123 Main St',
          postcode: 'AB12 3CD',
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          url: 'http://example.com',
        },
      },
    ];

    const pension: PensionArrangement = getMockPensionData(contactMethods);

    const transformedPension = transformPensionData(pension);

    expect(transformedPension.pensionAdministrator.contactMethods).toEqual([
      {
        preferred: false,
        contactMethodDetails: {
          number: '1234567890',
          usage: [UsageType.M],
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          number: '1234567890',
          usage: [UsageType.S],
        },
      },
      {
        preferred: true,
        contactMethodDetails: {
          email: 'example@example.com',
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          url: 'http://example.com',
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          postalName: 'John Doe',
          countryCode: 'GB',
          line1: '123 Main St',
          postcode: 'AB12 3CD',
        },
      },
    ]);
  });

  it('should handle empty contact methods', () => {
    const pension: PensionArrangement = getMockPensionData([]);
    const transformedPension = transformPensionData(pension);

    expect(transformedPension.pensionAdministrator.contactMethods).toEqual([]);
  });
});
