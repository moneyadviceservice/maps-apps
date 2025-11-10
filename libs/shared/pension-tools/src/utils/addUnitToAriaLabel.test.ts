import useTranslation from '@maps-react/hooks/useTranslation';

import { addUnitToAriaLabel } from './addUnitToAriaLabel';

const mockZ = (translations: { en: string; cy: string }) => {
  const currentLang = 'en';
  return translations[currentLang];
};
const en = mockZ as ReturnType<typeof useTranslation>['z'];
const welshZ = (translations: { en: string; cy: string }) => {
  const currentLang = 'cy';
  return translations[currentLang];
};
const cy = welshZ as ReturnType<typeof useTranslation>['z'];

describe('addUnitToAriaLabel', () => {
  it.each`
    description                                                                   | label                       | unit         | zMock | expected
    ${'should return label with uppercase "In" for English when ending with "."'} | ${'Enter your weight.'}     | ${'pounds'}  | ${en} | ${'Enter your weight. In pounds.'}
    ${'should return label with uppercase "Yn" for Welsh when ending with "."'}   | ${'Rhowch eich pwysau.'}    | ${'pounds'}  | ${cy} | ${'Rhowch eich pwysau. Yn bunnoedd.'}
    ${'should return label with lowercase "in" for English when no punctuation'}  | ${'Enter your height'}      | ${'years'}   | ${en} | ${'Enter your height, in years'}
    ${'should return label with lowercase "yn" for Welsh when no punctuation'}    | ${'Rhowch eich taldra'}     | ${'years'}   | ${cy} | ${'Rhowch eich taldra, yn blynyddoedd'}
    ${'should handle label with "?" punctuation for English'}                     | ${'What is your height?'}   | ${'percent'} | ${en} | ${'What is your height? In percent.'}
    ${'should handle label with "?" punctuation for Welsh'}                       | ${'Beth yw eich taldra?'}   | ${'percent'} | ${cy} | ${'Beth yw eich taldra? Yn y cant.'}
    ${'should handle label with ":" punctuation for English'}                     | ${'What is your height:'}   | ${'pounds'}  | ${en} | ${'What is your height, in pounds.'}
    ${'should handle label with ":" punctuation for Welsh'}                       | ${'Beth yw eich taldra:'}   | ${'pounds'}  | ${cy} | ${'Beth yw eich taldra, yn bunnoedd.'}
    ${'should trim the label before processing'}                                  | ${'  Enter your savings  '} | ${'pounds'}  | ${en} | ${'Enter your savings, in pounds'}
  `('$description', ({ label, unit, zMock, expected }) => {
    const result = addUnitToAriaLabel(label, unit, zMock);
    expect(result).toBe(expected);
  });
});
