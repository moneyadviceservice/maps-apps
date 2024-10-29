import { generatePageTitle } from './generatePageTitle';
import useTranslation from '@maps-react/hooks/useTranslation';

jest.mock('@maps-react/hooks/useTranslation');

describe('generatePageTitle', () => {
  const mockTranslationFunction = jest.fn((translations) => {
    return translations.en;
  });

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: mockTranslationFunction,
    });
  });

  it('should generate the correct page title in English', () => {
    const title = 'Test Page';

    const result = generatePageTitle(title, mockTranslationFunction);

    expect(mockTranslationFunction).toHaveBeenCalledWith({
      en: 'Money Adviser Network',
      cy: 'Rhwydwaith Cynghorwyr Arian',
    });
    expect(mockTranslationFunction).toHaveBeenCalledWith({
      en: 'MoneyHelper Tools',
      cy: 'Teclynnau HelpwrArian',
    });

    expect(result).toBe('Money Adviser Network: Test Page - MoneyHelper Tools');
  });

  it('should generate the correct page title in Welsh', () => {
    mockTranslationFunction.mockImplementation(
      (translations) => translations.cy,
    );

    const title = 'Tudalen Prawf';

    const result = generatePageTitle(title, mockTranslationFunction);

    expect(result).toBe(
      'Rhwydwaith Cynghorwyr Arian: Tudalen Prawf - Teclynnau HelpwrArian',
    );
  });
});
