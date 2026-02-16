import { render, screen } from '@testing-library/react';
import { ResultsHelpText } from './ResultsHelpText';
import useTranslation from '@maps-react/hooks/useTranslation';
import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('ResultsHelpText', () => {
  beforeEach(() => {
    // Default to English
    mockUseTranslation.mockReturnValue({
      z: ({ en }: { en: any; cy: any }) => en,
    });
  });

  it('renders English text and links', () => {
    render(<ResultsHelpText className="test-class" />);

    // Check paragraph exists
    const paragraph = screen.getByText(/This is a realistic estimate/i);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('test-class');

    // Check first link
    const hmrcLink = screen.getByText('contact HMRC');
    expect(hmrcLink).toBeInTheDocument();
    expect(hmrcLink).toHaveAttribute('href', 'https://www.gov.uk/contact-hmrc');

    // Check second link
    const payslipLink = screen.getByText('understand your payslip');
    expect(payslipLink).toBeInTheDocument();
    expect(payslipLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/work/employment/understanding-your-payslip',
    );
  });

  it('renders Welsh text and links', () => {
    // Override mock to return Welsh
    mockUseTranslation.mockReturnValue({
      z: ({ cy }: { en: any; cy: any }) => cy,
    });

    render(<ResultsHelpText />);

    // Check main Welsh text
    expect(
      screen.getByText(/Mae hwn yn amcangyfrif realistig/i),
    ).toBeInTheDocument();

    // Check first Welsh link
    const hmrcLink = screen.getByText('cysylltwch â CThEF');
    expect(hmrcLink).toBeInTheDocument();
    expect(hmrcLink).toHaveAttribute('href', 'https://www.gov.uk/contact-hmrc');

    // Check second Welsh link
    const payslipLink = screen.getByText('ddeall eich slip cyflog');
    expect(payslipLink).toBeInTheDocument();
    expect(payslipLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/cy/work/employment/understanding-your-payslip',
    );
  });
});
