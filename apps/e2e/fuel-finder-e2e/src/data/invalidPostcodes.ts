/**
 * Represents a single invalid postcode test scenario.
 *
 * @typedef {Object} InvalidCase
 * @property {string} label - Human-readable name for the test case
 * @property {string} code - The invalid postcode input value
 * @property {boolean} shouldStayOnPage - Indicates that the user should remain on the same page (no navigation)
 * @property {{
 *   en: string;
 *   cy: string;
 * }} errorMessage - Expected validation error message in different languages
 */

/**
 * Collection of invalid postcode test cases used to verify:
 * - Validation behaviour
 * - Error message display
 * - Language-specific messaging (English & Welsh)
 *
 * All cases are expected to:
 * - Keep the user on the same page
 * - Display an appropriate error message
 *
 * @type {readonly InvalidCase[]}
 */
export const invalidCases = [
  {
    /** Empty input should trigger required field validation */
    label: 'Empty PostCode',
    code: '',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'Enter a city, town, or postcode',
      cy: 'Rhowch ddinas, tref neu god post.',
    },
  },
  {
    /** Non-existent postcode format */
    label: 'PostCode-ZZ1 ZZ1',
    code: 'ZZ1 ZZ1',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Numeric-only input (invalid postcode format) */
    label: 'PostCode-12345',
    code: '12345',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Excessively long alphabetical input */
    label: 'PostCode-ABCDEFGHIJ',
    code: 'ABCDEFGHIJ',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Input containing only special characters */
    label: 'SpecialCharacters-Only',
    code: '!!£$%^&*£)',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Place name with special character */
    label: 'PlaceName-Leeds%',
    code: 'Leeds%',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Alphanumeric value with special character */
    label: 'Alphanumeric-test*123',
    code: 'test*123',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Only plus symbols */
    label: 'OnlySpecialCharacters',
    code: '+++++++',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
  {
    /** Place name containing special character */
    label: 'PlaceName-Belf@st',
    code: 'Belf@st',
    shouldStayOnPage: true,
    errorMessage: {
      en: 'We could not find that location. Please check and try again.',
      cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
    },
  },
] as const;
