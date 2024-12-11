import { mockPensionDetail, mockPensionsData } from '../mocks';
import { getPensionDetail } from './get-pension-detail';
import { getPensionData, UserSession } from './get-pensions-data';

jest.mock('./get-pensions-data');

let result;
const mockUserSession: UserSession = {
  userSessionId: '',
  authorizationCode: '',
}; // Declare and initialize the mockUserSession variable

describe('getPensionDetail', () => {
  beforeAll(() => {
    (getPensionData as jest.Mock).mockResolvedValue(mockPensionsData);
  });

  it('should return the policy if the id matches', async () => {
    // Act
    result = await getPensionDetail(
      'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
      mockUserSession,
    );

    // Assert
    expect(result).toEqual(mockPensionDetail[0]);
  });

  it('should return the policy if the id matches', async () => {
    // Act
    result = await getPensionDetail(
      'e4f88759-5c0b-4148-82aa-9c6611914e9c',
      mockUserSession,
    );

    // Assert
    expect(result).toEqual(mockPensionDetail[1]);
  });

  it('should return undefined if the id does not match', async () => {
    // Act
    result = await getPensionDetail('invalid-id', mockUserSession);

    // Assert
    expect(result).toEqual(undefined);
  });

  it('should return undefined if the id is not found in the mockPensionDetail array', async () => {
    // Act
    result = await getPensionDetail('non-existent-id', mockUserSession);

    // Assert
    expect(result).toEqual(undefined);
  });

  it('should return null if the data retrieval is not complete', async () => {
    // Arrange
    (getPensionData as jest.Mock).mockResolvedValue({
      ...mockPensionsData,
      pensionsDataRetrievalComplete: false,
    });

    // Act
    result = await getPensionDetail(
      'b3cd4ebd-8a49-4ebc-a15e-1e79dff1e5ad',
      mockUserSession,
    );

    // Assert
    expect(result).toEqual(null);
  });

  it('should return undefined if the id is not provided', async () => {
    // Act
    result = await getPensionDetail('', mockUserSession);

    // Assert
    expect(result).toEqual(null);
  });
});
