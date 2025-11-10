import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { STATE_RETIREMENT_AGE } from '../../lib/constants';
import { PensionTotals } from '../../lib/types';
import { currencyAmount } from '../../lib/utils/ui';
import { SummaryCallout } from './SummaryCallout';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils/ui');

describe('SummaryCallout', () => {
  const mockUseTranslation = useTranslation as jest.Mock;
  const mockCurrencyAmount = currencyAmount as jest.Mock;

  const totals: PensionTotals = { monthlyTotal: 1000, annualTotal: 12000 };

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (
        key: string,
        params?: { age?: number; monthlyTotal?: string; annualTotal?: string },
      ) => {
        const translations: Record<string, string> = {
          'common.amount-unavailable': '£unavailable',
          'pages.your-pension-breakdown.callout.heading':
            'Your Pension Breakdown',
          'pages.your-pension-breakdown.callout.description': `At age ${params?.age}, your monthly total is ${params?.monthlyTotal} and your annual total is ${params?.annualTotal}.`,
        };
        return translations[key];
      },
    });

    mockCurrencyAmount.mockImplementation(
      (amount: number) => `£${amount.toFixed(2)}`,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<SummaryCallout totals={totals} />);

    expect(container).toMatchSnapshot();
  });

  it('renders the heading correctly', () => {
    const { getByText } = render(<SummaryCallout totals={totals} />);

    expect(getByText('Your Pension Breakdown')).toBeInTheDocument();
  });

  it('renders the description with correct values when totals are available', () => {
    const { getByText } = render(<SummaryCallout totals={totals} />);

    expect(
      getByText(
        `At age ${STATE_RETIREMENT_AGE}, your monthly total is £1000.00 and your annual total is £12000.00.`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the description with unavailable amounts when totals are not available', () => {
    const { getByText } = render(
      <SummaryCallout totals={{ monthlyTotal: 0, annualTotal: 0 }} />,
    );

    expect(
      getByText(
        `At age ${STATE_RETIREMENT_AGE}, your monthly total is £unavailable and your annual total is £unavailable.`,
      ),
    ).toBeInTheDocument();
  });
});
