import useTranslation from '@maps-react/hooks/useTranslation';

import { generatePageTitle } from './generatePageTitle';

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

    expect(result).toBe('Test Page - Money Adviser Network');
  });

  it('should generate the correct page title in Welsh', () => {
    mockTranslationFunction.mockImplementation(
      (translations) => translations.cy,
    );

    const title = 'Tudalen Prawf';

    const result = generatePageTitle(title, mockTranslationFunction);

    expect(result).toBe('Tudalen Prawf - Rhwydwaith Cynghorwyr Arian');
  });
});
