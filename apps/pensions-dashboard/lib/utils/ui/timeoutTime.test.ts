import { timeoutTime } from './timeoutTime';

describe('timeoutTime', () => {
  const mockT = jest.fn();

  beforeEach(() => {
    mockT.mockClear();
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'timeout.minute': 'minute',
        'timeout.minutes': 'minutes',
        'timeout.second': 'second',
        'timeout.seconds': 'seconds',
      };
      return translations[key] || key;
    });
  });

  describe('when both minutes and seconds are provided', () => {
    it('should return formatted string with plural values', () => {
      const result = timeoutTime(2, 30, mockT);

      expect(result).toBe('2 minutes 30 seconds');
      expect(mockT).toHaveBeenCalledWith('timeout.minutes');
      expect(mockT).toHaveBeenCalledWith('timeout.seconds');
    });

    it('should return formatted string with singular values', () => {
      const result = timeoutTime(1, 1, mockT);

      expect(result).toBe('1 minute 1 second');
      expect(mockT).toHaveBeenCalledWith('timeout.minute');
      expect(mockT).toHaveBeenCalledWith('timeout.second');
    });
  });

  describe('when only minutes are provided', () => {
    it('should return formatted string with plural minutes only', () => {
      const result = timeoutTime(10, 0, mockT);

      expect(result).toBe('10 minutes');
      expect(mockT).toHaveBeenCalledWith('timeout.minutes');
      expect(mockT).not.toHaveBeenCalledWith('timeout.seconds');
      expect(mockT).not.toHaveBeenCalledWith('timeout.second');
    });

    it('should return formatted string with singular minute only', () => {
      const result = timeoutTime(1, 0, mockT);

      expect(result).toBe('1 minute');
      expect(mockT).toHaveBeenCalledWith('timeout.minute');
      expect(mockT).not.toHaveBeenCalledWith('timeout.seconds');
      expect(mockT).not.toHaveBeenCalledWith('timeout.second');
    });
  });

  describe('when only seconds are provided', () => {
    it('should return formatted string with plural seconds only', () => {
      const result = timeoutTime(0, 30, mockT);

      expect(result).toBe('30 seconds');
      expect(mockT).toHaveBeenCalledWith('timeout.seconds');
      expect(mockT).not.toHaveBeenCalledWith('timeout.minutes');
      expect(mockT).not.toHaveBeenCalledWith('timeout.minute');
    });

    it('should return formatted string with singular second only', () => {
      const result = timeoutTime(0, 1, mockT);

      expect(result).toBe('1 second');
      expect(mockT).toHaveBeenCalledWith('timeout.second');
      expect(mockT).not.toHaveBeenCalledWith('timeout.seconds');
      expect(mockT).not.toHaveBeenCalledWith('timeout.minutes');
      expect(mockT).not.toHaveBeenCalledWith('timeout.minute');
    });
  });

  describe('edge cases', () => {
    it('should return empty string when both minutes and seconds are zero', () => {
      const result = timeoutTime(0, 0, mockT);

      expect(result).toBe('');
      expect(mockT).not.toHaveBeenCalled();
    });

    it('should handle negative values by treating them as zero', () => {
      const result = timeoutTime(-5, -10, mockT);

      expect(result).toBe('');
      expect(mockT).not.toHaveBeenCalled();
    });
  });
});
