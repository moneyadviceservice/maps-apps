import {
  mockConfirmedPensions,
  mockConfirmedPensionsNoIncome,
  mockIncompletePensions,
  mockUnconfirmedPensions,
  mockUnsupportedPensions,
} from '../mocks';
import { PensionsOverviewModel } from '../types';
import { getAllPensions } from './get-all-pensions';
import { UserSession } from './get-pensions-data';
import { getPensionsOverview } from './get-pensions-overview';

// Mock the dependencies
jest.mock('./get-all-pensions');

let result;
const mockUserSession: UserSession = {
  userSessionId: 'test-session-id',
  authorizationCode: 'test-auth-code',
}; // Declare and initialize the mockUserSession variable

describe('getPensionsOverview', () => {
  it('should return the correct pensions overview', async () => {
    // Arrange
    (getAllPensions as jest.Mock).mockResolvedValue({
      greenPensions: mockConfirmedPensions,
      yellowPensions: mockIncompletePensions,
      redPensions: mockUnconfirmedPensions,
      greenPensionsNoIncome: mockConfirmedPensionsNoIncome,
      unsupportedPensions: mockUnsupportedPensions,
    });

    const expectedOverview = {
      totalPensions: 8,
      greenPensions: mockConfirmedPensions,
      yellowPensions: mockIncompletePensions,
      redPensions: mockUnconfirmedPensions,
      greenPensionsNoIncome: mockConfirmedPensionsNoIncome,
      unsupportedPensions: mockUnsupportedPensions,
    };

    // Act
    result = await getPensionsOverview(mockUserSession);

    // Assert
    expect(result).toEqual(expectedOverview);
  });

  it('should handle empty pension lists', async () => {
    // Arrange
    (getAllPensions as jest.Mock).mockResolvedValue({
      greenPensions: [],
      yellowPensions: [],
      redPensions: [],
      greenPensionsNoIncome: [],
      unsupportedPensions: [],
    });

    const expectedOverview: PensionsOverviewModel = {
      totalPensions: 0,
      greenPensions: [],
      yellowPensions: [],
      redPensions: [],
      greenPensionsNoIncome: [],
      unsupportedPensions: [],
    };

    // Act
    result = await getPensionsOverview(mockUserSession);

    // Assert
    expect(result).toEqual(expectedOverview);
  });

  it('should handle errors when fetching pensions', async () => {
    // Arrange
    const errorMessage = 'Error fetching pensions';
    (getAllPensions as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(getPensionsOverview(mockUserSession)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should return null if no pensions data is returned', async () => {
    // Arrange
    (getAllPensions as jest.Mock).mockResolvedValue(null);

    // Act
    result = await getPensionsOverview(mockUserSession);

    // Assert
    expect(result).toBeNull();
  });

  it('should handle unexpected response format', async () => {
    // Arrange
    (getAllPensions as jest.Mock).mockResolvedValue({
      // Missing the 'confirmedPensions' property
      incompletePensions: mockIncompletePensions,
      unconfirmedPensions: mockUnconfirmedPensions,
    });

    // Act and Assert
    await expect(getPensionsOverview(mockUserSession)).rejects.toThrow();
  });
});
