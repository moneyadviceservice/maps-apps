import { NO_DATA } from '../constants';
import { mockPensionDetails, mockPensionsData } from '../mocks';
import { PensionArrangement } from '../types';
import { getRetirementDate } from './getRetirementDate';

const mockData = mockPensionDetails as PensionArrangement;
const mockDataNoPayableDate = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;
const mockNoRetirementDate = { ...mockDataNoPayableDate, retirementDate: '' };

describe('getRetirementDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted payableDate if available', () => {
    expect(getRetirementDate(mockData)).toBe('23 February 2042');
  });

  it('should return formatted retirement date if no payable date available', () => {
    expect(getRetirementDate(mockDataNoPayableDate)).toBe('23 August 2025');
  });

  it('should return formatted retirement date if no payable date available', () => {
    expect(getRetirementDate(mockNoRetirementDate)).toBe(NO_DATA);
  });
});
