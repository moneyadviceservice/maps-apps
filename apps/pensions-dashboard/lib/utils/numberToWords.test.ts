import { NUMBER_WORDS } from '../constants';
import { numberToWords } from './numberToWords';

describe('numberToWords', () => {
  it('should return the English word for the number', () => {
    expect(numberToWords(0, 'en')).toBe('zero');
    expect(numberToWords(1, 'en')).toBe('one');
    expect(numberToWords(2, 'en')).toBe('two');
    expect(numberToWords(12, 'en')).toBe('twelve');
  });

  it('should return the Welsh word for the number', () => {
    expect(numberToWords(0, 'cy')).toBe('sero');
    expect(numberToWords(1, 'cy')).toBe('un');
    expect(numberToWords(2, 'cy')).toBe('dau');
  });

  it('should return the number itself if it exceeds or is the same as the length of NUMBER_WORDS', () => {
    expect(numberToWords(NUMBER_WORDS.length + 1, 'en')).toBe(
      NUMBER_WORDS.length + 1,
    );
    expect(numberToWords(100, 'en')).toBe(100);
    expect(numberToWords(NUMBER_WORDS.length, 'en')).toBe(NUMBER_WORDS.length);
  });
});
