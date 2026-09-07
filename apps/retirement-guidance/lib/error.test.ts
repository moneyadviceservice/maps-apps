import { getError } from './error';
import { retirementGuidanceErrorMessages } from '../data/errors';

jest.mock('../data/errors', () => ({
  retirementGuidanceErrorMessages: jest.fn(),
}));

const mockRetirementGuidanceErrorMessages =
  retirementGuidanceErrorMessages as jest.MockedFunction<
    typeof retirementGuidanceErrorMessages
  >;

describe('test getError utility function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty errors array when hasError is false', () => {
    const result = getError(1, false);

    expect(result).toEqual({
      errors: [],
    });
    expect(mockRetirementGuidanceErrorMessages).not.toHaveBeenCalled();
  });

  it('should return errors when hasError is true', () => {
    const mockErrors = [
      {
        question: 1,
        message: 'Please select an option',
      },
    ];
    mockRetirementGuidanceErrorMessages.mockReturnValue(mockErrors);

    const result = getError(1, true);

    expect(result).toEqual({
      errors: mockErrors,
    });
    expect(mockRetirementGuidanceErrorMessages).toHaveBeenCalledWith(1);
  });

  it('should work with different question numbers', () => {
    const mockErrors = [
      {
        question: 5,
        message: 'Question 5 error',
      },
    ];
    mockRetirementGuidanceErrorMessages.mockReturnValue(mockErrors);

    const result = getError(5, true);

    expect(result).toEqual({
      errors: mockErrors,
    });
    expect(mockRetirementGuidanceErrorMessages).toHaveBeenCalledWith(5);
  });

  it('should handle empty error array from retirementGuidanceErrorMessages', () => {
    mockRetirementGuidanceErrorMessages.mockReturnValue([]);

    const result = getError(3, true);

    expect(result).toEqual({
      errors: [],
    });
    expect(mockRetirementGuidanceErrorMessages).toHaveBeenCalledWith(3);
  });

  it('should maintain consistent return structure', () => {
    const result1 = getError(1, false);
    const result2 = getError(1, true);

    // Both should have the same structure
    expect(result1).toHaveProperty('errors');
    expect(result2).toHaveProperty('errors');
    expect(Array.isArray(result1.errors)).toBe(true);
    expect(Array.isArray(result2.errors)).toBe(true);
  });
});
