import { getAllPensions } from '../fetch/get-all-pensions';
import { getPensionData, UserSession } from '../fetch/get-pensions-data';
import {
  mockConfirmedPensions,
  mockIncompletePensions,
  mockPensionsData,
  mockUnconfirmedPensions,
  mockUnsupportedPensions,
} from '../mocks';

jest.mock('./get-pensions-data');

let result;
const mockUserSession: UserSession = {
  userSessionId: 'test-session-id',
  authorizationCode: 'test-auth-code',
}; // Declare mockUserSession variable

describe('getAllPensions', () => {
  it('should return null if data retrieval is not complete', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionsDataRetrievalComplete: false,
    });

    // Act
    result = await getAllPensions(mockUserSession);

    // Assert
    expect(result).toEqual(null);
  });
});

describe('getRedPensions', () => {
  beforeAll(() => {
    (getPensionData as jest.Mock).mockResolvedValue(mockPensionsData);
  });

  it('should return red pensions if matchType is POSS or CONT or matchType is DEFN and exclusion is MEM', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionPolicies: [
        {
          pensionArrangements: [
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
              matchType: 'POSS',
            },
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
              matchType: 'CONT',
            },
            mockPensionsData.pensionPolicies[0].pensionArrangements[3],
          ],
        },
      ],
    });

    // Act
    result = await getAllPensions(mockUserSession);

    // Act
    expect(result?.redPensions).toEqual(mockUnconfirmedPensions);
  });

  it('should return an empty array if the matchType is not POSS or it is DEFN and exclusion is not MEM, PPF or WU', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionPolicies: [
        {
          pensionArrangements: [
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
              matchType: '',
            },
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[1],
            },
          ],
        },
      ],
    });

    // Act
    result = await getAllPensions(mockUserSession);

    // Act
    expect(result?.redPensions).toEqual([]);
  });
});

describe('getGreenPensions', () => {
  it('should return confirmed pensions', async () => {
    const userSession: UserSession = {
      userSessionId: '',
      authorizationCode: '',
    };
    const mockData = {
      pensionPolicies: [
        {
          pensionArrangements: [mockConfirmedPensions[0]],
        },
      ],
    };

    (getPensionData as jest.Mock).mockResolvedValue(mockPensionsData);

    const result = await getAllPensions(userSession);

    expect(result?.greenPensions).toEqual(
      mockData.pensionPolicies[0].pensionArrangements,
    );
  });
});

describe('getUnsupportedPensions', () => {
  it('should return unsupported pensions', async () => {
    const userSession: UserSession = {
      userSessionId: '',
      authorizationCode: '',
    };
    const mockData = {
      pensionPolicies: [
        {
          pensionArrangements: [mockUnsupportedPensions[0]],
        },
      ],
    };

    (getPensionData as jest.Mock).mockResolvedValue(mockPensionsData);

    const result = await getAllPensions(userSession);

    expect(result?.unsupportedPensions).toEqual(
      mockData.pensionPolicies[0].pensionArrangements,
    );
  });
});

describe('getYellowPensions', () => {
  beforeAll(() => {
    (getPensionData as jest.Mock).mockResolvedValue(mockPensionsData);
  });

  it('should return incomplete pensions if excluded reason is DBC, DCC, NEW, ANO, NET or TRN', async () => {
    // Act
    result = await getAllPensions(mockUserSession);

    // Assert
    expect(result?.yellowPensions).toEqual(mockIncompletePensions);
  });
  it('should return an empty array if the matchType is not DEFN', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionPolicies: [
        {
          pensionArrangements: [
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
              matchType: '',
            },
          ],
        },
      ],
    });

    // Act
    result = await getAllPensions(mockUserSession);

    // Assert
    expect(result?.yellowPensions).toEqual([]);
  });

  it('should return an empty array if the unavailableReason is not DBC, DCC or NEW', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionPolicies: [
        {
          pensionArrangements: [
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
              benefitIllustrations: [
                {
                  illustrationComponents: [
                    {
                      ...mockPensionsData.pensionPolicies[0]
                        .pensionArrangements[0].benefitIllustrations[0]
                        .illustrationComponents[0],
                      unavailableReason: 'MEM',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // Act
    result = await getAllPensions(mockUserSession);

    // Assert
    expect(result?.yellowPensions).toEqual([]);
  });

  it('should return an empty array if the benefitIllustrations is not defined', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionPolicies: [
        {
          pensionArrangements: [
            {
              ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
              benefitIllustrations: undefined,
            },
          ],
        },
      ],
    });

    // Act
    result = await getAllPensions(mockUserSession);

    // Assert
    expect(result?.yellowPensions).toEqual([]);
  });
});
