import { isValidLocationInput } from './isValidLocationInput';

describe('isValidLocationInput', () => {
  describe('accepts permitted characters (AC1)', () => {
    it.each([
      // Real places using each permitted special character.
      'Stoke-on-trent',
      'St. Albans',
      'Dagenham & Redbridge',
      // Welsh place name with an accented letter (Unicode \p{L}).
      'Ynys Môn',
      // Pass character validation even though geocoding will not find them.
      'abcde',
      'Manchester1234',
      '&789-',
      // Only-allowed-special-character inputs still pass (geocoding returns
      // the centre of GB downstream).
      '!!!!!!!!!!',
      "-&!.'",
    ])('accepts %j', (value) => {
      expect(isValidLocationInput(value)).toBe(true);
    });
  });

  describe('rejects characters outside the permitted set (AC2)', () => {
    it.each(['£$%^&*£)', 'Leeds%', 'test*123', '+++++++', 'Belf@st', ''])(
      'rejects %j',
      (value) => {
        expect(isValidLocationInput(value)).toBe(false);
      },
    );
  });
});
