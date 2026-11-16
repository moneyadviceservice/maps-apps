import { render, screen } from '@testing-library/react';

import { DeathBenefitsSGR4 } from './DeathBenefitsSGR4';

import '@testing-library/jest-dom';

const mockTranslations: Record<string, string> = {
  'results.staticGuidance.deathBenefitsSGR4.title':
    'Understand what happens to your pension when you die',
  'results.staticGuidance.deathBenefitsSGR4.paragraph1':
    'You can tell your pension provider who you would like to receive your pension when you die, called your beneficiaries.',
  'results.staticGuidance.deathBenefitsSGR4.paragraph2':
    'You usually do this by completing their expression of wish form.',
  'results.staticGuidance.deathBenefitsSGR4.paragraph3':
    'Depending on the type of pension you have, your beneficiaries will usually either receive:',
  'results.staticGuidance.deathBenefitsSGR4.list1':
    'your remaining pension pot',
  'results.staticGuidance.deathBenefitsSGR4.list2':
    'a portion of your regular income, typically called death benefits',
  'results.staticGuidance.deathBenefitsSGR4.paragraph4':
    'For full information, including how the money is taxed, see our guide What happens to my pension when I die?',
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => mockTranslations[key] || key,
  })),
}));

describe('DeathBenefitsSGR4', () => {
  it('should render the component', () => {
    render(<DeathBenefitsSGR4 />);

    const section = screen.getByTestId('death-benefits-sgr4-section');
    expect(section).toBeInTheDocument();
  });

  it.each([
    [
      'title',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.title'],
    ],
    [
      'beneficiaries paragraph',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.paragraph1'],
    ],
    [
      'expression of wish paragraph',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.paragraph2'],
    ],
    [
      'death benefits list intro',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.paragraph3'],
    ],
    [
      'remaining pension pot list item',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.list1'],
    ],
    [
      'death benefits list item',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.list2'],
    ],
    [
      'guide paragraph',
      mockTranslations['results.staticGuidance.deathBenefitsSGR4.paragraph4'],
    ],
  ])('should render the %s', (_label, text) => {
    render(<DeathBenefitsSGR4 />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
