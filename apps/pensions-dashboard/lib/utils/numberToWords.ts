import { NUMBER_WORDS } from '../constants';

export const numberToWords = (num: number) =>
  num > NUMBER_WORDS.length ? num : NUMBER_WORDS[num].en;
