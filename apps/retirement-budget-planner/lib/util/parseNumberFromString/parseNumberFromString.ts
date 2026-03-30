/**
 * parseNumberFromString
 *
 * Removes all non-numeric characters (except for decimal points and minus
 * signs) from the input string, then parses to a decimal number.
 *
 * If the resulting string cannot be parsed into a valid number, it returns 0.
 *
 * Note that this function assumes UK number formatting (e.g. "£1,234.56") and
 * will break for any other formatting style (e.g. "1.234,56").
 *
 * @param {string} input string containing a number
 * @returns {number} number parsed from the string
 */
export const parseNumberFromString = (input: string): number => {
  const parsedNum = Number.parseFloat(input.replaceAll(/[^\d.-]/g, ''));

  if (Number.isNaN(parsedNum)) {
    console.error(
      `Error parsing number from string: "${input}" resulted in NaN. Returning 0 as fallback.`,
    );

    return 0;
  }

  return parsedNum;
};
