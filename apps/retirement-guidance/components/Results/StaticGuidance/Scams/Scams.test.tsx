import { render, screen } from '@testing-library/react';

import { ScamsSGR6 } from './Scams';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.staticGuidance.scamsSGR6.title':
          'Protect yourself from pension scams',
        'results.staticGuidance.scamsSGR6.paragraph1':
          'Pension scams are a serious problem. Scammers may contact you offering free pension reviews or high returns.',
        'results.staticGuidance.scamsSGR6.paragraph2':
          'Be cautious of unsolicited contact about your pension and never rush into any decisions.',
        'results.staticGuidance.scamsSGR6.paragraph3':
          'If you suspect a scam, report it to Action Fraud and contact The Pensions Regulator.',
      };
      return translations[key] || key;
    },
  })),
}));

describe('ScamsSGR6', () => {
  it('should render the component', () => {
    render(<ScamsSGR6 />);

    const section = screen.getByTestId('scams-sgr6-section');
    expect(section).toBeInTheDocument();
  });

  it('should render the correct title', () => {
    render(<ScamsSGR6 />);

    const title = screen.getByText('Protect yourself from pension scams');
    expect(title).toBeInTheDocument();
  });

  it('should render the first paragraph content', () => {
    render(<ScamsSGR6 />);

    const paragraph1 = screen.getByText(
      'Pension scams are a serious problem. Scammers may contact you offering free pension reviews or high returns.',
    );
    expect(paragraph1).toBeInTheDocument();
  });

  it('should render the second paragraph content', () => {
    render(<ScamsSGR6 />);

    const paragraph2 = screen.getByText(
      'Be cautious of unsolicited contact about your pension and never rush into any decisions.',
    );
    expect(paragraph2).toBeInTheDocument();
  });

  it('should render the third paragraph content', () => {
    render(<ScamsSGR6 />);

    const paragraph3 = screen.getByText(
      'If you suspect a scam, report it to Action Fraud and contact The Pensions Regulator.',
    );
    expect(paragraph3).toBeInTheDocument();
  });

  it('should render all three Markdown components', () => {
    render(<ScamsSGR6 />);

    const section = screen.getByTestId('scams-sgr6-section');
    expect(section).toHaveTextContent(
      'Pension scams are a serious problem. Scammers may contact you offering free pension reviews or high returns.',
    );
    expect(section).toHaveTextContent(
      'Be cautious of unsolicited contact about your pension and never rush into any decisions.',
    );
    expect(section).toHaveTextContent(
      'If you suspect a scam, report it to Action Fraud and contact The Pensions Regulator.',
    );
  });
});
