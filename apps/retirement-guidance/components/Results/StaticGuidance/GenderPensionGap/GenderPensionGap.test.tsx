import { render, screen } from '@testing-library/react';

import { GenderPensionGapSGR3 } from './GenderPensionGap';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.staticGuidance.genderPensionGapSGR3.title':
          'The gender pension gap',
        'results.staticGuidance.genderPensionGapSGR3.paragraph1':
          'Women often have lower pension savings than men due to factors like career breaks and part-time work.',
        'results.staticGuidance.genderPensionGapSGR3.paragraph2':
          'This can mean women have less income in retirement and need to plan more carefully.',
        'results.staticGuidance.genderPensionGapSGR3.paragraph3':
          'Consider seeking professional financial advice to make the most of your pension savings.',
      };
      return translations[key] || key;
    },
  })),
}));

describe('GenderPensionGapSGR3', () => {
  it('should render the component', () => {
    render(<GenderPensionGapSGR3 />);

    const section = screen.getByTestId('gender-pension-gap-sgr3-section');
    expect(section).toBeInTheDocument();
  });

  it('should render the correct title', () => {
    render(<GenderPensionGapSGR3 />);

    const title = screen.getByText('The gender pension gap');
    expect(title).toBeInTheDocument();
  });

  it('should render the first paragraph content', () => {
    render(<GenderPensionGapSGR3 />);

    const paragraph1 = screen.getByText(
      'Women often have lower pension savings than men due to factors like career breaks and part-time work.',
    );
    expect(paragraph1).toBeInTheDocument();
  });

  it('should render the second paragraph content', () => {
    render(<GenderPensionGapSGR3 />);

    const paragraph2 = screen.getByText(
      'This can mean women have less income in retirement and need to plan more carefully.',
    );
    expect(paragraph2).toBeInTheDocument();
  });

  it('should render the third paragraph content', () => {
    render(<GenderPensionGapSGR3 />);

    const paragraph3 = screen.getByText(
      'Consider seeking professional financial advice to make the most of your pension savings.',
    );
    expect(paragraph3).toBeInTheDocument();
  });

  it('should render all three Markdown components', () => {
    render(<GenderPensionGapSGR3 />);

    const section = screen.getByTestId('gender-pension-gap-sgr3-section');
    // The section should contain all three paragraphs
    expect(section).toHaveTextContent(
      'Women often have lower pension savings than men due to factors like career breaks and part-time work.',
    );
    expect(section).toHaveTextContent(
      'This can mean women have less income in retirement and need to plan more carefully.',
    );
    expect(section).toHaveTextContent(
      'Consider seeking professional financial advice to make the most of your pension savings.',
    );
  });
});
