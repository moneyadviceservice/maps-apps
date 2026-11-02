import { render, screen } from '@testing-library/react';

import { BenefitsSGR1 } from './BenefitsSGR1';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.staticGuidance.benefitsSGR1.title':
          'Check if you can claim Pension Credit',
        'results.staticGuidance.benefitsSGR1.paragraph1':
          'If you receive benefits, taking money from your pension pot could affect how much you get.',
        'results.staticGuidance.benefitsSGR1.paragraph2':
          'Check with the relevant benefits office before making any decisions.',
        'results.staticGuidance.benefitsSGR1.details': 'More details here',
      };
      return translations[key] || key;
    },
  })),
}));

describe('BenefitsSGR1', () => {
  it('should render the component', () => {
    render(<BenefitsSGR1 />);

    const section = screen.getByTestId('retirement-benefits-section');
    expect(section).toBeInTheDocument();
  });

  it('should render the correct title', () => {
    render(<BenefitsSGR1 />);

    const title = screen.getByText('Check if you can claim Pension Credit');
    expect(title).toBeInTheDocument();
  });

  it('should render the first paragraph content', () => {
    render(<BenefitsSGR1 />);

    const paragraph1 = screen.getByText(
      'If you receive benefits, taking money from your pension pot could affect how much you get.',
    );
    expect(paragraph1).toBeInTheDocument();
  });

  it('should render the second paragraph content', () => {
    render(<BenefitsSGR1 />);

    const paragraph2 = screen.getByText(
      'Check with the relevant benefits office before making any decisions.',
    );
    expect(paragraph2).toBeInTheDocument();
  });

  it('should render both Markdown components', () => {
    render(<BenefitsSGR1 />);

    const section = screen.getByTestId('retirement-benefits-section');

    expect(section).toHaveTextContent(
      'If you receive benefits, taking money from your pension pot could affect how much you get.',
    );
    expect(section).toHaveTextContent(
      'Check with the relevant benefits office before making any decisions.',
    );
  });
});
