import { MatchType, PensionType } from '../constants';
import { mockPensionsData } from '../mocks';
import { ContactMethod, PensionArrangement } from '../types';
import { PostalAddress } from './../types/index';
import { transformPensionData } from './transformPensionData';
/**
 * Generates mock pension data.
 *
 * @param contactMethods - An array of contact methods.
 * @returns A PensionArrangement object representing mock pension data.
 */
const getMockPensionData = (
  contactMethods: ContactMethod[],
): PensionArrangement => {
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

let mockPension: PensionArrangement;
let mockTransformedPension: PensionArrangement;
let mockContactMethods: ContactMethod[];

describe('transformPensionData', () => {
  it('should sort the email contacts alphabetically by the email property', () => {
    // Arrange
    mockContactMethods = [
      mockPensionsData.pensionPolicies[0].pensionArrangements[1]
        .pensionAdministrator.contactMethods[1] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .pensionAdministrator.contactMethods[1] as ContactMethod,
    ];

    // Act
    mockPension = getMockPensionData(mockContactMethods);
    mockTransformedPension = transformPensionData(mockPension);

    // Assert
    expect(mockTransformedPension.pensionAdministrator.contactMethods).toEqual([
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .pensionAdministrator.contactMethods[1] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[1]
        .pensionAdministrator.contactMethods[1] as ContactMethod,
    ]);
  });

  it('should sort the phone contacts alphabetically by the UsageType property', () => {
    // Arrange
    mockContactMethods = [
      mockPensionsData.pensionPolicies[0].pensionArrangements[1]
        .pensionAdministrator.contactMethods[2] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .pensionAdministrator.contactMethods[2] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[2]
        .pensionAdministrator.contactMethods[2] as ContactMethod,
    ];

    // Act
    mockPension = getMockPensionData(mockContactMethods);
    mockTransformedPension = transformPensionData(mockPension);

    // Assert
    expect(mockTransformedPension.pensionAdministrator.contactMethods).toEqual([
      {
        contactMethodDetails: { number: '+44 8007310175', usage: ['M'] },
        preferred: false,
      },
      {
        contactMethodDetails: { number: '+44 800873434', usage: ['M'] },
        preferred: false,
      },
      {
        contactMethodDetails: { number: '+44 800093434', usage: ['S'] },
        preferred: false,
      },
      {
        contactMethodDetails: { number: '+44 8007310175', usage: ['W'] },
        preferred: false,
      },
    ]);
  });
  it('should sort postalContact with country code of "GB" to the top, and then sort alphabetically by postalName', () => {
    // Arrange
    mockContactMethods = [
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .pensionAdministrator.contactMethods[3] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[1]
        .pensionAdministrator.contactMethods[3] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .pensionAdministrator.contactMethods[3] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[2]
        .pensionAdministrator.contactMethods[0] as ContactMethod,
    ];

    // Act
    mockPension = getMockPensionData(mockContactMethods);
    mockTransformedPension = transformPensionData(mockPension);

    // Assert - GB is always first, and then the rest are sorted alphabetically by postalName
    expect(
      (
        mockTransformedPension.pensionAdministrator.contactMethods[0]
          .contactMethodDetails as PostalAddress
      ).countryCode,
    ).toBe('GB');
    expect(
      (
        mockTransformedPension.pensionAdministrator.contactMethods[0]
          .contactMethodDetails as PostalAddress
      ).postalName,
    ).toBe('Freepost DWP');
    expect(
      (
        mockTransformedPension.pensionAdministrator.contactMethods[2]
          .contactMethodDetails as PostalAddress
      ).postalName,
    ).toBe('Pension Admin Highland');
    expect(
      (
        mockTransformedPension.pensionAdministrator.contactMethods[3]
          .contactMethodDetails as PostalAddress
      ).countryCode,
    ).toBe('');
  });

  it('should sort web contacts alphabetically by the UsageType url property', () => {
    // Arrange
    mockContactMethods = [
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .pensionAdministrator.contactMethods[0] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[1]
        .pensionAdministrator.contactMethods[0] as ContactMethod,
      mockPensionsData.pensionPolicies[0].pensionArrangements[2]
        .pensionAdministrator.contactMethods[1] as ContactMethod,
    ];

    // Act
    mockPension = getMockPensionData(mockContactMethods);
    mockTransformedPension = transformPensionData(mockPension);

    // Assert
    expect(mockTransformedPension.pensionAdministrator.contactMethods).toEqual([
      {
        contactMethodDetails: { url: 'https://www.everypension.co.uk' },
        preferred: false,
      },
      {
        contactMethodDetails: {
          url: 'https://www.gov.uk/future-pension-centre',
        },
        preferred: true,
      },
      {
        contactMethodDetails: { url: 'https://www.highlandadmin.co.uk' },
        preferred: true,
      },
    ]);
  });

  it('should handle empty contact methods', () => {
    mockPension = getMockPensionData([]);
    mockTransformedPension = transformPensionData(mockPension);
    expect(mockTransformedPension.pensionAdministrator.contactMethods).toEqual(
      [],
    );
  });
});
