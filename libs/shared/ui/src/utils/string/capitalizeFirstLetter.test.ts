import { capitalizeFirstLetter } from './capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
  it.each([
    [
      'should capitalize the first letter of a lowercase string',
      'hello',
      'Hello',
    ],
    [
      'should capitalize the first letter of a string with mixed case',
      'hELLO',
      'HELLO',
    ],
    [
      'should not change a string that already starts with a capital letter',
      'Hello',
      'Hello',
    ],
    ['should handle single character strings', 'a', 'A'],
    ['should handle multi-word strings', 'hello world', 'Hello world'],
    ['should preserve whitespace at the beginning', ' hello', ' hello'],
    [
      'should handle string beginning with numeric characters',
      '123abc',
      '123abc',
    ],
    ['should handle empty string', '', ''],
    ['should handle string comprising only whitespace', '   ', '   '],
  ])('%s', (testLabel, input, expectedOutput) => {
    expect(capitalizeFirstLetter(input)).toBe(expectedOutput);
  });
});
