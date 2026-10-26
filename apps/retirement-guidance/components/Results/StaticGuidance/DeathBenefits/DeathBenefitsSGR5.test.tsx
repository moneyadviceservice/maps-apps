import { render, screen } from '@testing-library/react';

import { DeathBenefitsSGR5 } from './DeathBenefitsSGR5';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.staticGuidance.deathBenefitsSGR5.title':
          'Death benefits and your pension options',
        'results.staticGuidance.deathBenefitsSGR5.paragraph1':
          'Different pension options have different rules about what happens when you die.',
        'results.staticGuidance.deathBenefitsSGR5.paragraph2':
          'If you take your pension as an annuity, you can choose to include benefits for your dependants.',
        'results.staticGuidance.deathBenefitsSGR5.paragraph3':
          'If you leave your money invested, it can usually be passed on to your beneficiaries.',
        'results.staticGuidance.deathBenefitsSGR5.paragraph4':
          'Consider how important it is to provide for others when choosing your pension option.',
      };
      return translations[key] || key;
    },
  })),
}));

describe('DeathBenefitsSGR5', () => {
  it('should render the component', () => {
    render(<DeathBenefitsSGR5 />);

    const section = screen.getByTestId('death-benefits-sgr5-section');
    expect(section).toBeInTheDocument();
  });

  it('should render the correct title', () => {
    render(<DeathBenefitsSGR5 />);

    const title = screen.getByText('Death benefits and your pension options');
    expect(title).toBeInTheDocument();
  });

  it('should render the first paragraph content', () => {
    render(<DeathBenefitsSGR5 />);

    const paragraph1 = screen.getByText(
      'Different pension options have different rules about what happens when you die.',
    );
    expect(paragraph1).toBeInTheDocument();
  });

  it('should render the second paragraph content', () => {
    render(<DeathBenefitsSGR5 />);

    const paragraph2 = screen.getByText(
      'If you take your pension as an annuity, you can choose to include benefits for your dependants.',
    );
    expect(paragraph2).toBeInTheDocument();
  });

  it('should render the third paragraph content', () => {
    render(<DeathBenefitsSGR5 />);

    const paragraph3 = screen.getByText(
      'If you leave your money invested, it can usually be passed on to your beneficiaries.',
    );
    expect(paragraph3).toBeInTheDocument();
  });

  it('should render the fourth paragraph content', () => {
    render(<DeathBenefitsSGR5 />);

    const paragraph4 = screen.getByText(
      'Consider how important it is to provide for others when choosing your pension option.',
    );
    expect(paragraph4).toBeInTheDocument();
  });

  it('should render all four Markdown components', () => {
    render(<DeathBenefitsSGR5 />);

    const section = screen.getByTestId('death-benefits-sgr5-section');
    // The section should contain all four paragraphs
    expect(section).toHaveTextContent(
      'Different pension options have different rules about what happens when you die.',
    );
    expect(section).toHaveTextContent(
      'If you take your pension as an annuity, you can choose to include benefits for your dependants.',
    );
    expect(section).toHaveTextContent(
      'If you leave your money invested, it can usually be passed on to your beneficiaries.',
    );
    expect(section).toHaveTextContent(
      'Consider how important it is to provide for others when choosing your pension option.',
    );
  });
});
