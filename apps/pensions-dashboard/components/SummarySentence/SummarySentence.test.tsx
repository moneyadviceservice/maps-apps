import { render, screen, within } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SummaryData } from '../../lib/types';
import { SummarySentence } from './SummarySentence';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockSummaryData = {
  standardPayment: {
    monthlyAmount: 2875.5,
    annualAmount: 34506,
  },
  statePensionDate: '2042-02-23',
  isMcCloudPensionPresent: false,
} as SummaryData;

const mockMcCloudSummaryData = {
  legacyPayment: {
    monthlyAmount: 3875.5,
    annualAmount: 44506,
  },
  alternativePayment: {
    monthlyAmount: 3500,
    annualAmount: 40000,
  },
  statePensionDate: '2042-02-23',
  isMcCloudPensionPresent: true,
} as SummaryData;

describe('SummarySentence', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, params?: Record<string, string | number>) => {
        const translations: Record<string, string> = {
          'components.summary-sentence.state-pension-age':
            'In {{statePensionYear}}, how much could you get from your pensions that year (before tax)?',
          'components.summary-sentence.annually': '{{annualTotal}} per year',
          'components.summary-sentence.snapshot':
            'This is a snapshot based on information as of {{statePensionYear}}',
          'components.summary-sentence.no-state-pension-1':
            'We cannot find your State Pension information',
          'components.summary-sentence.no-state-pension-2':
            'Income is in the timeline',
          'common.a-month': 'a month',
          'components.summary-sentence.mccloud-title': 'You have two options',
          'components.income-timeline.legacy': 'Legacy',
          'components.income-timeline.alternative': 'Alternative',
          'components.income-timeline.option': 'option',
          'components.summary-sentence.specific-year-accordion-title':
            'Why have we used a specific year?',
          'components.summary-sentence.specific-year-accordion-content':
            'This is the year you will reach State Pension age - the age you can claim your State Pension. You might start taking other pensions before or after this.',
        };
        let result = translations[key] || key;
        if (params) {
          for (const param of Object.keys(params)) {
            result = result.replace(`{{${param}}}`, String(params[param]));
          }
        }
        return result;
      },
      tList: () => ['item1', 'item2'],
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the summary with state pension year when available', () => {
    render(<SummarySentence data={mockSummaryData} />);

    const summaryBox = screen.getByTestId('summary-sentence-with-sp');

    expect(screen.getByTestId('summary-title')).toBeInTheDocument();
    expect(summaryBox).toBeInTheDocument();
    expect(
      screen.getByText(
        'In 2042, how much could you get from your pensions that year (before tax)?',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a snapshot based on information as of 2042'),
    ).toBeInTheDocument();
    expect(screen.getByText('£2,875.50 a month')).toBeInTheDocument();
    expect(screen.getByText('£34,506 per year')).toBeInTheDocument();
    expect(screen.getByTestId('summary-accordion')).toBeInTheDocument();
    expect(
      screen.getByTestId('specific-year-accordion-mobile'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('specific-year-accordion-desktop'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Income is in the timeline/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/We cannot find your State Pension information/),
    ).not.toBeInTheDocument();
    expect(within(summaryBox).getByTestId('timeline-link')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-link')).toHaveAttribute(
      'href',
      '/en/your-pensions-timeline',
    );
  });

  it('renders the McCloud specific summary items with state pension year for McCloud schemes', () => {
    render(<SummarySentence data={mockMcCloudSummaryData} />);

    expect(screen.getByText('You have two options')).toBeInTheDocument();
    expect(screen.getByText('Legacy option')).toBeInTheDocument();
    expect(screen.getByText('£3,875.50 a month')).toBeInTheDocument();
    expect(screen.getByText('£44,506 per year')).toBeInTheDocument();
    expect(screen.getByText('Alternative option')).toBeInTheDocument();
    expect(screen.getByText('£3,500 a month')).toBeInTheDocument();
    expect(screen.getByText('£40,000 per year')).toBeInTheDocument();
    expect(screen.getByTestId('mccloud-accordion-desktop')).toBeInTheDocument();
    expect(
      screen.getByTestId('specific-year-accordion-mobile'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('specific-year-accordion-desktop'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('timeline-link')).toHaveAttribute(
      'href',
      '/en/your-pensions-timeline?income=legacy',
    );
  });

  it('renders the correct summary when state pension is not available', () => {
    render(<SummarySentence data={undefined} />);

    expect(screen.getByTestId('summary-title')).toBeInTheDocument();
    expect(screen.getByTestId('summary-sentence-no-sp')).toBeInTheDocument();
    expect(
      screen.getByText('We cannot find your State Pension information'),
    ).toBeInTheDocument();
    expect(screen.getByText('Income is in the timeline')).toBeInTheDocument();
    expect(screen.getByTestId('summary-sentence-no-sp-2')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-accordion')).not.toBeInTheDocument();
    expect(screen.queryByText(/snapshot/)).not.toBeInTheDocument();
    expect(screen.queryByText(/a month/)).not.toBeInTheDocument();
    expect(screen.queryByText(/per year/)).not.toBeInTheDocument();
    expect(screen.getByTestId('timeline-link')).toBeInTheDocument();
  });

  it('does not render the timeline info when showTimeline is false with a state pension', () => {
    render(<SummarySentence data={mockSummaryData} showTimeline={false} />);

    expect(screen.getByTestId('summary-sentence-with-sp')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline-link')).not.toBeInTheDocument();
  });

  it('does not render the timeline info when showTimeline is false without a state pension', () => {
    render(<SummarySentence data={undefined} showTimeline={false} />);

    const intro = screen.getByText(
      'We cannot find your State Pension information',
    );

    expect(screen.getByTestId('summary-sentence-no-sp')).toBeInTheDocument();
    expect(intro).toBeInTheDocument();
    expect(intro).not.toHaveClass('mb-8', 'lg:mb-12');
    expect(screen.queryByTestId('timeline-link')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('summary-sentence-no-sp-2'),
    ).not.toBeInTheDocument();
  });
});
