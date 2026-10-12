import { MatchType, UnavailableReason } from '../../constants';
import { filterUnavailableCode } from './filterUnavailableCode';

let result;

describe('filterUnavailableCode', () => {
  it('should return SYS_MATCHTYPE when matchType is SYS', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.SYS);

    // Assert
    expect(result).toBe('SYS_MATCHTYPE');
  });

  it('should return NEW_MATCHTYPE when matchType is NEW', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.NEW);

    // Assert
    expect(result).toBe('NEW_MATCHTYPE');
  });

  it('should return the unavailableCode when MatchType is not SYS or NEW and unavailableCode is defined', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.DEFN, UnavailableReason.DBC);

    // Assert
    expect(result).toBe(UnavailableReason.DBC);
  });

  it('should return an empty string when unavailableCode is undefined', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.DEFN);

    // Assert
    expect(result).toBe('');
  });
});
