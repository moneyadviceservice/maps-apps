import { render, screen } from '@testing-library/react';

import { PreRetirementBenefitsSGR2 } from './PreRetirementBenefitsSGR2';

import '@testing-library/jest-dom';

const mockTranslations: Record<string, string> = {
  'results.staticGuidance.preRetirementBenefitsSGR2.title':
    'Check if you can claim Pension Credit, plus other grants and discounts',
  'results.staticGuidance.preRetirementBenefitsSGR2.paragraph1':
    'If you are expecting to have a low retirement income, check if you are entitled to Pension Credit to boost your income.',
  'results.staticGuidance.preRetirementBenefitsSGR2.paragraph2':
    'Even if you do not qualify for much extra money, it can make you eligible for other grants and help.',
  'results.staticGuidance.preRetirementBenefitsSGR2.paragraph3':
    'You can use our Benefits calculator to see what you are entitled to.',
  'results.staticGuidance.preRetirementBenefitsSGR2.paragraph4':
    'You might also be able to get help paying certain costs. For example:',
  'results.staticGuidance.preRetirementBenefitsSGR2.list1':
    'help with your heating bills',
  'results.staticGuidance.preRetirementBenefitsSGR2.list2':
    'help with housing and care costs',
  'results.staticGuidance.preRetirementBenefitsSGR2.list3': 'a free TV licence',
  'results.staticGuidance.preRetirementBenefitsSGR2.list4':
    'help with dental treatment.',
  'results.staticGuidance.preRetirementBenefitsSGR2.paragraph5':
    'Find out more in our guide about benefits in retirement.',
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => mockTranslations[key] || key,
  })),
}));

describe('PreRetirementBenefitsSGR2', () => {
  it('should render the component', () => {
    render(<PreRetirementBenefitsSGR2 />);

    const section = screen.getByTestId('retirement-pre-benefits-section');
    expect(section).toBeInTheDocument();
  });

  it('should render with correct contentId', () => {
    const { container } = render(<PreRetirementBenefitsSGR2 />);

    const content = container.querySelector('#pre-retirement-benefits-content');
    expect(content).toBeInTheDocument();
  });

  it.each([
    [
      'title',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.title'
      ],
    ],
    [
      'first paragraph',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.paragraph1'
      ],
    ],
    [
      'second paragraph',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.paragraph2'
      ],
    ],
    [
      'benefits calculator paragraph',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.paragraph3'
      ],
    ],
    [
      'extra costs intro',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.paragraph4'
      ],
    ],
    [
      'heating bills list item',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.list1'
      ],
    ],
    [
      'housing and care costs list item',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.list2'
      ],
    ],
    [
      'TV licence list item',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.list3'
      ],
    ],
    [
      'dental treatment list item',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.list4'
      ],
    ],
    [
      'benefits in retirement guide',
      mockTranslations[
        'results.staticGuidance.preRetirementBenefitsSGR2.paragraph5'
      ],
    ],
  ])('should render the %s', (_label, text) => {
    render(<PreRetirementBenefitsSGR2 />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
