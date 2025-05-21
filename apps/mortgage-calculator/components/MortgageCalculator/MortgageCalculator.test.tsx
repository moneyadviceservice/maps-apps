import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import { CalculationResult, MortgageCalculator } from './MortgageCalculator';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('./MortgageCalculator', () => ({
  ...jest.requireActual('./MortgageCalculator'),
  fireToolStartEvent: jest.fn(),
  handleRadioInputEvent: jest.fn(),
}));

const { fireToolStartEvent, handleRadioInputEvent } = jest.requireMock(
  './MortgageCalculator',
);

const mockAdobeDataLayer: AnalyticsData[] = [];
(global.window.adobeDataLayer as unknown as AnalyticsData[]) =
  mockAdobeDataLayer;

const calculationResult: CalculationResult = {
  debt: 0,
  balanceBreakdown: [],
  capitalSplit: 0,
  changedPayment: 0,
  interestSplit: 0,
  monthlyPayment: 0,
  totalAmount: 0,
};
const initialDeposit = '60000';
const analyticsData = {
  page: {
    pageName: 'pageName',
    pageTitle: 'pageTitle',
  },
  tool: {
    stepName: 'stepName',
    toolName: 'toolName',
    toolStep: 'toolStep',
  },
  event: 'event',
};

jest.mock(
  '../../public/images/teaser-card-images/calculator_house.png',
  () => ({
    src: '/images/teaser-card-images/calculator_house.png',
    height: 100,
    width: 100,
    blurDataURL: 'data:image/jpeg;base64,fake',
  }),
);
jest.mock(
  '../../public/images/teaser-card-images/calculator_house2.png',
  () => ({
    src: '/images/teaser-card-images/calculator_house2.png',
    height: 100,
    width: 100,
    blurDataURL: 'data:image/jpeg;base64,fake',
  }),
);

describe('Mortgage calculator', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    render(
      <MortgageCalculator
        calculationType="repayment"
        price="7500000"
        deposit={initialDeposit}
        termYears="25"
        rate={5.25}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('does not allow the deposit field to be greater than 999,999,999', () => {
    const input = screen.getByLabelText<HTMLInputElement>('Deposit (Optional)');

    expect(input.value).toBe('60,000');
    fireEvent.change(input, { target: { value: '999999999' } });
    expect(input.value).toBe('999,999,999');
    fireEvent.change(input, { target: { value: '9999999991' } });
    expect(input.value).toBe('999,999,999');
  });

  it('does allow the deposit field to be edited after SSR population', () => {
    const input = screen.getByLabelText<HTMLInputElement>('Deposit (Optional)');

    expect(input.value).toBe('60,000');
    fireEvent.change(input, { target: { value: '75000' } });
    expect(input.value).toBe('75,000');
  });

  it('should have aria-label attribute', () => {
    expect(
      screen
        .getByLabelText<HTMLInputElement>('Property price')
        .getAttribute('aria-label'),
    ).toBe(
      "Property price in pounds. If you're not buying a property, enter the amount left on your mortgage.",
    );
    expect(
      screen
        .getByLabelText<HTMLInputElement>('Deposit (Optional)')
        .getAttribute('aria-label'),
    ).toBe("Deposit in pounds. If you're remortgaging, this does not apply.");
    expect(
      screen
        .getByLabelText<HTMLInputElement>('Interest rate')
        .getAttribute('aria-label'),
    ).toBe("Interest rate %. We've defaulted to the current interest rate.");
  });

  it('validates interest rate input to be between 0 and 99.99', () => {
    render(
      <MortgageCalculator
        calculationType="repayment"
        price="7500000"
        deposit={initialDeposit}
        termYears="25"
        rate={100} // Exceeds the limit
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    const input = screen.getByLabelText<HTMLInputElement>('Interest rate');

    expect(input.value).toBe('5.25');

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('');
  });

  it('validates interest rate input to be above 0', () => {
    render(
      <MortgageCalculator
        calculationType="repayment"
        price="7500000"
        deposit={initialDeposit}
        termYears="25"
        rate={0}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    const input = screen.getByLabelText<HTMLInputElement>('Interest rate');

    expect(input.value).toBe('5.25');
  });

  it('shows error summary when required fields are empty', () => {
    cleanup();
    render(
      <MortgageCalculator
        calculationType="repayment"
        price=""
        deposit={initialDeposit}
        termYears="25"
        rate={5.25}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    const errorSummaryContainer = screen.getByTestId('error-summary-container');
    expect(errorSummaryContainer).toBeVisible();
  });

  it('shows RecommendedReading and OtherTools when calculation is successful', () => {
    expect(screen.getByText('Recommended reading')).toBeInTheDocument();
    expect(screen.getByText('Other tools to try')).toBeInTheDocument();
  });

  it('changes button text after calculation', async () => {
    cleanup();

    render(
      <MortgageCalculator
        calculationType="repayment"
        price="60000"
        deposit={initialDeposit}
        termYears="25"
        rate={5.25}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    const calculateButton = screen.getByTestId('calculate-submit-button');
    expect(calculateButton).toHaveTextContent('Recalculate');

    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(calculateButton).toHaveTextContent('Recalculate');
    });
  });

  it('renders mortgage term select with correct options', () => {
    const select = screen.getByLabelText('Mortgage term');
    const options = select.getElementsByTagName('option');

    expect(options.length).toBe(41);
    expect(options[1].value).toBe('1');
    expect(options[25].value).toBe('25');
    expect(options[25].selected).toBe(true);
  });

  it('tracks analytics events on form interaction', () => {
    const priceInput =
      screen.getByLabelText<HTMLInputElement>('Property price');
    fireEvent.change(priceInput, { target: { value: '200000' } });

    expect(mockAdobeDataLayer).toContainEqual(
      expect.objectContaining({
        event: 'toolInteraction',
        eventInfo: expect.objectContaining({
          toolName: 'Mortgage Calculator',
          reactCompType: 'MoneyInput',
          reactCompName: 'Property price',
        }),
      }),
    );
  });

  it('handles radio button selection for mortgage type', () => {
    const interestOnlyRadio = screen.getByLabelText(/Interest-only/);
    fireEvent.click(interestOnlyRadio);

    expect(interestOnlyRadio).toBeChecked();
    expect(screen.getByLabelText(/Repayment/)).not.toBeChecked();
  });

  it('displays urgent callout', () => {
    expect(screen.getByTestId('urgent-callout')).toBeInTheDocument();
  });

  it('displays an error message when interest rate input is invalid', () => {
    cleanup();
    render(
      <MortgageCalculator
        calculationType="repayment"
        price="7500000"
        deposit={initialDeposit}
        termYears="25"
        rate={NaN}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    expect(screen.getByTestId('error-link-1')).toHaveTextContent(
      'Enter an interest rate, for example 5%',
    );
  });

  it('focuses on the price input when error link is clicked', async () => {
    cleanup();
    render(
      <MortgageCalculator
        calculationType="repayment"
        price=""
        deposit={initialDeposit}
        termYears="25"
        rate={5.25}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    const errorLink = screen.getByTestId('error-link-0');
    fireEvent.click(errorLink);

    await waitFor(() => {
      const priceInput = screen.getByLabelText('Property price');
      expect(document.activeElement).toBe(priceInput);
    });
  });

  it('focuses on errorRef and resets clickedErrorMessage when handleCalculate is called with errors', async () => {
    cleanup();
    render(
      <MortgageCalculator
        calculationType="repayment"
        price=""
        deposit={initialDeposit}
        termYears="25"
        rate={5.25}
        calculationResult={calculationResult}
        analyticsData={analyticsData}
      />,
    );

    const calculateButton = screen.getByTestId('calculate-submit-button');
    fireEvent.click(calculateButton);

    await waitFor(() => {
      const errorSummaryContainer = screen.getByTestId(
        'error-summary-container',
      );
      expect(document.activeElement).toBe(errorSummaryContainer);
    });
  });

  it('calls fireToolStartEvent and handleRadioInputEvent on radio button focus', () => {
    const repaymentRadio = screen.getByLabelText(/Repayment/);

    fireToolStartEvent();
    handleRadioInputEvent(1);

    fireEvent.focus(repaymentRadio);

    expect(fireToolStartEvent).toHaveBeenCalled();
    expect(handleRadioInputEvent).toHaveBeenCalledWith(expect.any(Number));
  });

  it('tracks analytics events on mortgage term selection', () => {
    const select = screen.getByLabelText('Mortgage term');
    fireEvent.change(select, { target: { value: '30' } });

    expect(mockAdobeDataLayer).toContainEqual(
      expect.objectContaining({
        event: 'toolInteraction',
        eventInfo: expect.objectContaining({
          toolName: 'Mortgage Calculator',
          reactCompType: 'Select',
          reactCompName: 'Mortgage term',
        }),
      }),
    );
  });

  it('handles radio button selection for interest-only mortgage type', () => {
    const interestOnlyRadio = screen.getByLabelText(/Interest-only/);
    fireToolStartEvent();
    handleRadioInputEvent(1);
    fireEvent.focus(interestOnlyRadio);

    expect(fireToolStartEvent).toHaveBeenCalled();
    expect(handleRadioInputEvent).toHaveBeenCalledWith(expect.any(Number));
  });

  it('validates deposit input to not exceed 999,999,999', () => {
    const input = screen.getByLabelText<HTMLInputElement>('Deposit (Optional)');

    fireEvent.change(input, { target: { value: '999999999' } });
    expect(input.value).toBe('999,999,999');

    fireEvent.change(input, { target: { value: '1000000000' } });
    expect(input.value).toBe('999,999,999');

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('');
  });
});
