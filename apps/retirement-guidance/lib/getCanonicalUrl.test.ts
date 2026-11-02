import { getCanonicalUrl } from './getCanonicalUrl';

describe('getCanonicalUrl', () => {
  it.each`
    language                | expected
    ${'en'}                 | ${'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/get-retirement-guidance'}
    ${'cy'}                 | ${'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/get-retirement-guidance'}
    ${'not-a-valid-locale'} | ${'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/get-retirement-guidance'}
  `(
    'should generate the expected canonical URL for $language',
    ({ language, expected }) => {
      const result = getCanonicalUrl(language);
      expect(result).toBe(expected);
    },
  );
});
