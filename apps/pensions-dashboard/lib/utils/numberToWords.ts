import { NUMBER_WORDS } from '../constants';

export const numberToWords = (num: number, locale: 'en' | 'cy') =>
  num > NUMBER_WORDS.length ? num : NUMBER_WORDS[num][locale];
