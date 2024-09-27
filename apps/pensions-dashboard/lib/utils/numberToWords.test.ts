import { NUMBER_WORDS } from '../constants';
import { numberToWords } from './numberToWords';

describe('numberToWords', () => {
  it('should return the English word for the number', () => {
    expect(numberToWords(0)).toBe('zero');
    expect(numberToWords(1)).toBe('one');
    expect(numberToWords(2)).toBe('two');
  });

  it('should return the Welsh word for the number', () => {
    expect(NUMBER_WORDS[0].cy).toBe('sero');
    expect(NUMBER_WORDS[1].cy).toBe('un');
    expect(NUMBER_WORDS[2].cy).toBe('dau');
  });

  it('should return the number itself if it exceeds the length of NUMBER_WORDS', () => {
    expect(numberToWords(NUMBER_WORDS.length + 1)).toBe(
      NUMBER_WORDS.length + 1,
    );
    expect(numberToWords(100)).toBe(100);
  });
});
