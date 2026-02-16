import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SummaryData } from '../../lib/types';
import { SummarySentence } from './SummarySentence';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockSummaryData = {
  monthlyTotal: 2875.5,
  annualTotal: 34506,
  statePensionDate: '2042-02-23',
} as SummaryData;

describe('SummarySentence', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, params?: any) => {
        const translations: Record<string, string> = {
          'components.summary-sentence.state-pension-age':
            'At your State Pension age in {{statePensionYear}} you could get',
          'components.summary-sentence.annually': '{{annualTotal}} per year',
          'components.summary-sentence.snapshot':
            'This is a snapshot based on information as of {{statePensionYear}}',
          'components.summary-sentence.no-state-pension-1':
            'We cannot find your State Pension information',
          'components.summary-sentence.no-state-pension-2':
            'Income is in the timeline',
          'common.a-month': 'a month',
        };
        let result = translations[key] || key;
        if (params) {
          for (const param of Object.keys(params)) {
            result = result.replace(`{{${param}}}`, params[param]);
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

    expect(screen.getByTestId('summary-title')).toBeInTheDocument();
    expect(screen.getByTestId('summary-sentence-with-sp')).toBeInTheDocument();
    expect(
      screen.getByText('At your State Pension age in 2042 you could get'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a snapshot based on information as of 2042'),
    ).toBeInTheDocument();
    expect(screen.getByText('£2,875.50 a month')).toBeInTheDocument();
    expect(screen.getByText('£34,506 per year')).toBeInTheDocument();
    expect(screen.getByTestId('summary-accordion')).toBeInTheDocument();
    expect(
      screen.queryByText(/Income is in the timeline/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/We cannot find your State Pension information/),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('timeline-link')).toBeInTheDocument();
  });

  it('renders the correct summary when state pension is not available', () => {
    render(<SummarySentence data={undefined} />);

    expect(screen.getByTestId('summary-title')).toBeInTheDocument();
    expect(screen.getByTestId('summary-sentence-no-sp')).toBeInTheDocument();
    expect(
      screen.getByText('We cannot find your State Pension information'),
    ).toBeInTheDocument();
    expect(screen.getByText('Income is in the timeline')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-accordion')).not.toBeInTheDocument();
    expect(screen.queryByText(/snapshot/)).not.toBeInTheDocument();
    expect(screen.queryByText(/a month/)).not.toBeInTheDocument();
    expect(screen.queryByText(/per year/)).not.toBeInTheDocument();
    expect(screen.getByTestId('timeline-link')).toBeInTheDocument();
  });
});
