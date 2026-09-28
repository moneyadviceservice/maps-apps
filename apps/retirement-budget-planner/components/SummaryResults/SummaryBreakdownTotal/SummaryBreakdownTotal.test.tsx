import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { SummaryBreakdownTotal } from './SummaryBreakdownTotal';

import {
  mockSubmittedData,
  mockSubmittedDataTaxedAtBasicRate,
  mockSubmittedDataTaxedAtHigherRate,
  mockSubmittedDataTaxedAtAdditionalRate,
} from 'lib/mocks/mockRetirementIncome';
import { mockPageData } from 'lib/mocks/mockEssentialOutgoings';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mockFn = jest.fn(() => ({
    t: (key: string) => mockTranslationDataEn[key] ?? key,
    locale: 'en',
  }));
  return {
    __esModule: true,
    useTranslation: mockFn,
    default: mockFn,
  };
});

const renderComponent = (
  overrides?: Partial<ComponentProps<typeof SummaryBreakdownTotal>>,
) => {
  const {
    income = mockSubmittedData,
    divider = 'month',
    ...remainingOverrides
  } = { ...overrides };

  return render(
    <SummaryBreakdownTotal
      income={income}
      costs={mockPageData()}
      divider={divider}
      tabName="summary"
      {...remainingOverrides}
    />,
  );
};

const dropdownTestId = 't-summary-options';
const incomeValueTestId = 't-summary-value-retirement-income-after-tax';
const costsValueTestId = 't-summary-value-retirement-costs';

describe('Summary breakdown & summary total component', () => {
  it('should render component correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should display total income / spending / balance when frequency is the monthly, default option', () => {
    renderComponent();

    const incomeValueElement = screen.getByTestId(incomeValueTestId);
    const costsValueElement = screen.getByTestId(costsValueTestId);

    expect(incomeValueElement).toHaveTextContent('£442.26');
    expect(costsValueElement).toHaveTextContent('£1,080.00');
  });

  it('should update total income / spending / balance when update the frequency dropdown', () => {
    renderComponent();

    const dropdownElement = screen.getByTestId(dropdownTestId);
    const incomeValueElement = screen.getByTestId(incomeValueTestId);
    const costsValueElement = screen.getByTestId(costsValueTestId);

    fireEvent.change(dropdownElement, { target: { value: 'year' } });

    expect(incomeValueElement).toHaveTextContent('£5,307.14');
    expect(costsValueElement).toHaveTextContent('£12,960.00');
  });

  it('should display yearly totals when initialized with year divider', () => {
    renderComponent({ divider: 'year' });

    const incomeValueElement = screen.getByTestId(incomeValueTestId);
    const costsValueElement = screen.getByTestId(costsValueTestId);

    expect(incomeValueElement).toHaveTextContent('£5,307.14');
    expect(costsValueElement).toHaveTextContent('£12,960.00');
  });

  it.each([
    {
      title: 'basic rate',
      input: {
        income: mockSubmittedDataTaxedAtBasicRate,
      },
      expected: {
        monthly: {
          income: '£1,542.83',
          costs: '£1,080.00',
        },
        yearly: {
          income: '£18,514.00',
          costs: '£12,960.00',
        },
      },
    },
    {
      title: 'higher rate',
      input: {
        income: mockSubmittedDataTaxedAtHigherRate,
      },
      expected: {
        monthly: {
          income: '£4,797.33',
          costs: '£1,080.00',
        },
        yearly: {
          income: '£57,568.00',
          costs: '£12,960.00',
        },
      },
    },
    {
      title: 'additional rate',
      input: {
        income: mockSubmittedDataTaxedAtAdditionalRate,
      },
      expected: {
        monthly: {
          income: '£8,024.75',
          costs: '£1,080.00',
        },
        yearly: {
          income: '£96,297.00',
          costs: '£12,960.00',
        },
      },
    },
  ])(
    'should render component correctly with taxed income at $title',
    ({ input, expected }) => {
      renderComponent(input);

      const dropdownElement = screen.getByTestId(dropdownTestId);
      const incomeValueElement = screen.getByTestId(incomeValueTestId);
      const costsValueElement = screen.getByTestId(costsValueTestId);

      expect(incomeValueElement).toHaveTextContent(expected.monthly.income);
      expect(costsValueElement).toHaveTextContent(expected.monthly.costs);

      fireEvent.change(dropdownElement, { target: { value: 'year' } });

      expect(incomeValueElement).toHaveTextContent(expected.yearly.income);
      expect(costsValueElement).toHaveTextContent(expected.yearly.costs);
    },
  );

  it.each([
    {
      title: 'basic rate',
      input: {
        income: mockSubmittedDataTaxedAtBasicRate,
        divider: 'year',
      },
      expected: {
        income: '£18,514.00',
        costs: '£12,960.00',
      },
    },
    {
      title: 'higher rate',
      input: {
        income: mockSubmittedDataTaxedAtHigherRate,
        divider: 'year',
      },
      expected: {
        income: '£57,568.00',
        costs: '£12,960.00',
      },
    },
    {
      title: 'additional rate',
      input: {
        income: mockSubmittedDataTaxedAtAdditionalRate,
        divider: 'year',
      },
      expected: {
        income: '£96,297.00',
        costs: '£12,960.00',
      },
    },
  ])(
    'should render component correctly with taxed income at $title (yearly divider)',
    ({ input, expected }) => {
      renderComponent(input);

      const incomeValueElement = screen.getByTestId(incomeValueTestId);
      const costsValueElement = screen.getByTestId(costsValueTestId);

      expect(incomeValueElement).toHaveTextContent(expected.income);
      expect(costsValueElement).toHaveTextContent(expected.costs);
    },
  );
});
