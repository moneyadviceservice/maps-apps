import {
  mockConfirmedPensions,
  mockConfirmedPensionsNoIncome,
  mockIncompletePensions,
  mockPensionsData,
  mockUnconfirmedPensions,
} from '../mocks';
import { getAllPensions } from './get-all-pensions';
import { getPensionDetail } from './get-pension-detail';
import { UserSession } from './get-pensions-data';

// Mock the dependencies
jest.mock('./get-all-pensions');

let result;
const mockUserSession: UserSession = {
  userSessionId: '',
  authorizationCode: '',
}; // Declare and initialize the mockUserSession variable

describe('getPensionDetail', () => {
  beforeAll(() => {
    (getAllPensions as jest.Mock).mockResolvedValue({
      greenPensions: mockConfirmedPensions,
      yellowPensions: mockIncompletePensions,
      redPensions: mockUnconfirmedPensions,
      greenPensionsNoIncome: mockConfirmedPensionsNoIncome,
    });
  });

  it('should return the correct pension detail', async () => {
    // Arrange
    const expectedPension =
      mockPensionsData.pensionPolicies[0].pensionArrangements[0];

    // Act
    result = await getPensionDetail(
      expectedPension.externalAssetId,
      mockUserSession,
    );

    // Assert
    expect(result).toEqual(expectedPension);
  });

  it('should return null if no data is found', async () => {
    // Arrange
    (getAllPensions as jest.Mock).mockResolvedValue(null);

    // Act
    result = await getPensionDetail('123', mockUserSession);

    // Assert
    expect(result).toBeNull();
  });
});
