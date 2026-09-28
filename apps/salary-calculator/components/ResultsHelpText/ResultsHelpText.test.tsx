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
    const paragraph = screen.getByText(
      /This is an estimate\. For more detailed results/i,
    );
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('test-class');
    expect(paragraph).toHaveTextContent(
      'This is an estimate. For more detailed results, contact HMRC. Need more help? MoneyHelper has guidance on how to Understand your payslip.',
    );

    // Check first link
    const hmrcLink = screen.getByText('contact HMRC');
    expect(hmrcLink).toBeInTheDocument();
    expect(hmrcLink).toHaveAttribute('href', 'https://www.gov.uk/contact-hmrc');

    // Check second link
    const payslipLink = screen.getByText('Understand your payslip');
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
    const paragraph = screen.getByText(
      /Amcangyfrif yw hwn\. I gael canlyniadau manylach/i,
    );
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(
      'Amcangyfrif yw hwn. I gael canlyniadau manylach, cysylltwch â CThEF. Angen mwy o help? Mae gan HelpwrArian ganllawiau ar sut i ddeall eich slip cyflog.',
    );

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
