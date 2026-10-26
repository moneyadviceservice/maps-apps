/**
 * A structured collection of postcode test data used across validation,
 * normalisation, and navigation test suites.
 *
 * @description
 * The `postcodes` object groups postcode strings into four categories:
 *
 * - **valid**: Real or acceptable postcode formats used to confirm correct
 *   behaviour in successful lookup scenarios.
 *
 * - **invalid**: Inputs that should trigger validation errors, warnings,
 *   or fallback behaviour (e.g., malformed, empty, or non‑existent codes).
 *
 * - **edge**: Inputs that test boundary conditions such as spacing,
 *   casing, regional formats (Wales, Northern Ireland), and length limits.
 *
 * - **other**: Additional well‑known UK postcodes used for broader coverage
 *   in integration or UI tests.
 *
 * @typedef {Object} PostcodeGroups
 * @property {Object.<string, string>} valid
 *   A set of valid postcode examples, including urban, rural, partial, and
 *   town‑based inputs and miscellaneous valid postcodes from major UK cities.
 *
 * @property {Object.<string, string>} edge
 *   Postcodes representing edge‑case formatting or regional variations.
  
 */

export const postcodes = {
  valid: {
    primary: 'MK42 9AB',
    secondary: 'MK5 7DL',
    rural: 'MK17 0EG',
    urban: 'MK9 3QA',
    partial: 'MK42',
    town: 'Bedford',
    city: 'Stoke-on-Trent',
    townWithSpace: 'St Albans',
    placeWithPunctuation: 'Westward Ho!',
    areaWithAmpersand: 'Dagenham & Redbridge',
    london: 'SW1A 1AA',
    manchester: 'M1 1AA',
    birmingham: 'B1 1AA',
    bristol: 'BS1 3AA',
    edinburgh: 'EH8 8DX',
    cardiff: 'CF10 1BH',
    belfast: 'BT1 1AA',
  },

  edge: {
    Wales: 'SA39 9HP',
    NorthernIreland: 'BT93 1QA',
    extraSpaces: 'MK42  9AB',
    lowercase: 'mk42 9ab',
    uppercase: 'MK42 9AB',
    noSpace: 'MK429AB',
    leadingSpace: ' MK42 9AB',
    trailingSpace: 'MK42 9AB ',
    bothSpaces: ' MK42 9AB ',
    tooLong: 'MK42 9AB 123',
  },
};
