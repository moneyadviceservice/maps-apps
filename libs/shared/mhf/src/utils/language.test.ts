import { getLanguage } from './language';

describe('language', () => {
  it.each([
    ['missing', undefined, 'en'],
    ['unsupported', 'fr', 'en'],
    ['multiple values with a supported first value', ['cy', 'en'], 'cy'],
    ['multiple values with an unsupported first value', ['fr', 'cy'], 'en'],
  ])(
    'normalises %s language input to %s',
    (_description, value, expectedLanguage) => {
      expect(getLanguage(value)).toBe(expectedLanguage);
    },
  );
});
