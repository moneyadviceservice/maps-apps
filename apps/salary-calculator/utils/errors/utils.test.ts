import useTranslation from '@maps-react/hooks/useTranslation';
import { parseErrors } from './utils';

type TranslationFunction = ReturnType<typeof useTranslation>['z'];

const mockZ: TranslationFunction = ((translations: any) => {
  if (typeof translations === 'object' && 'en' in translations) {
    return translations.en;
  }
  return translations;
}) as TranslationFunction;

describe('Parse Errors JSON', () => {
  it('Should return undefined if invalid json', () => {
    expect(parseErrors('not json', mockZ)).toBeUndefined();
  });

  it('Should return undefined if no errors', () => {
    expect(parseErrors(undefined, mockZ)).toBeUndefined();
  });

  it('Should return empty object if no array in json', () => {
    const result = parseErrors('{}', mockZ);

    expect(Object.keys(result!).length).toEqual(0);
  });

  it('Should return empty object if no errors in json', () => {
    const result = parseErrors('[]', mockZ);

    expect(Object.keys(result!).length).toEqual(0);
  });

  it('Should not add invalid errors to result', () => {
    const result = parseErrors('[{}]', mockZ);

    expect(Object.keys(result!).length).toEqual(0);
  });

  it('Should add valid errors to result', () => {
    const result = parseErrors(
      '[{}, {"field": "grossIncome", "type": "income-required"}]',
      mockZ,
    );

    expect(Object.keys(result!).length).toEqual(1);
  });
});
