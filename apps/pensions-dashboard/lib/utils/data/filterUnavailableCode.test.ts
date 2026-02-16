import { MatchType } from '../../constants';
import { filterUnavailableCode } from './filterUnavailableCode';

let result;

describe('filterUnavailableCode', () => {
  it('should return SYS_MATCHTYPE when matchType is SYS', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.SYS, undefined);

    // Assert
    expect(result).toBe('SYS_MATCHTYPE');
  });

  it('should return NEW_MATCHTYPE when matchType is NEW', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.NEW, undefined);

    // Assert
    expect(result).toBe('NEW_MATCHTYPE');
  });

  it('should return the unavailableCode when MatchType is not SYS or NEW and unavailableCode is defined', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.DEFN, 'DBC');

    // Assert
    expect(result).toBe('DBC');
  });

  it('should return an empty string when unavailableCode is undefined', () => {
    // Act & Arrange
    result = filterUnavailableCode(MatchType.DEFN, undefined);

    // Assert
    expect(result).toBe('');
  });
});
