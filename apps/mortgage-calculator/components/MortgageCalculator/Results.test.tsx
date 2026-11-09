import mockRouter from 'next-router-mock';

import { render, screen } from '@testing-library/react';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import { Results } from './Results';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => require('next-router-mock'));

const mockAdobeDataLayer: AnalyticsData[] = [];
(global.window.adobeDataLayer as unknown as AnalyticsData[]) =
  mockAdobeDataLayer;

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

describe('Mortgage Calculator', () => {
  it('shows the correct value for monthly payment when the value is positive', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: 7500,
          totalAmount: 100,
          interestSplit: 100,
          capitalSplit: -1,
          debt: 100,
          changedPayment: 100,
          balanceBreakdown: [{ year: 100, presentValue: 100 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#monthlyPayment');
    expect(actual?.textContent).toBe('£7,500');
  });

  it('shows a zero value for monthly payment when the value is negative', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: -1,
          totalAmount: 100,
          interestSplit: 100,
          capitalSplit: -1,
          debt: 100,
          changedPayment: 100,
          balanceBreakdown: [{ year: 100, presentValue: 100 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#monthlyPayment');
    expect(actual?.textContent).toBe('£0');
  });

  it('shows the correct value for total amount when the value is positive', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: -1,
          totalAmount: 7500000,
          interestSplit: -1,
          capitalSplit: -1,
          debt: -1,
          changedPayment: -1,
          balanceBreakdown: [{ year: -1, presentValue: -1 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#totalAmount');
    expect(actual?.textContent).toBe('£7,500,000');
  });

  it('shows a zero value for total amount when the value is negative', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: 100,
          totalAmount: -1,
          interestSplit: 100,
          capitalSplit: 100,
          debt: 100,
          changedPayment: 100,
          balanceBreakdown: [{ year: 100, presentValue: 100 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#totalAmount');
    expect(actual?.textContent).toBe('£0');
  });

  it('shows the correct value for capital when the value is positive', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: -1,
          totalAmount: -1,
          interestSplit: -1,
          capitalSplit: 80000,
          debt: -1,
          changedPayment: -1,
          balanceBreakdown: [{ year: -1, presentValue: -1 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#capitalAmount');
    expect(actual?.textContent).toBe('£80,000');
  });

  it('shows a zero value for capital when the value is negative', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: 100,
          totalAmount: 100,
          interestSplit: 100,
          capitalSplit: -1,
          debt: 100,
          changedPayment: 100,
          balanceBreakdown: [{ year: 100, presentValue: 100 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#capitalAmount');
    expect(actual?.textContent).toBe('£0');
  });

  it('shows the correct value for interest when the value is positive', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: -1,
          totalAmount: -1,
          interestSplit: 8000,
          capitalSplit: -1,
          debt: -1,
          changedPayment: -1,
          balanceBreakdown: [{ year: -1, presentValue: -1 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#interestAmount');
    expect(actual?.textContent).toBe('£8,000');
  });

  it('shows a zero value for interest when the value is negative', () => {
    const { container } = render(
      <Results
        calculationResult={{
          monthlyPayment: 100,
          totalAmount: 100,
          interestSplit: -1,
          capitalSplit: 100,
          debt: 100,
          changedPayment: 100,
          balanceBreakdown: [{ year: 100, presentValue: 100 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const actual = container.querySelector('#interestAmount');
    expect(actual?.textContent).toBe('£0');
  });

  it('shows a zero value in the table for the first row', () => {
    render(
      <Results
        calculationResult={{
          monthlyPayment: -100,
          totalAmount: -100,
          interestSplit: -100,
          capitalSplit: -100,
          debt: -100,
          changedPayment: -100,
          balanceBreakdown: [{ year: 0, presentValue: -999999 }],
        }}
        analyticsData={analyticsData}
      />,
    );

    const row = screen.getByRole('cell', { name: 'Year 0' }).closest('tr');
    expect(row?.children[1].textContent).toBe('£0');
  });

  it.each([
    { calculationType: 'repayment', description: 'repayment' },
    { calculationType: 'interestonly', description: 'Interest-only' },
  ])(
    'correctly identifies the mortgage type as $description from URL parameters',
    ({ calculationType }) => {
      mockRouter.push(`/?calculationType=${calculationType}`);

      render(
        <Results
          calculationResult={{
            monthlyPayment: 100,
            totalAmount: 100,
            interestSplit: 100,
            capitalSplit: 100,
            debt: 100,
            changedPayment: 100,
            balanceBreakdown: [{ year: 100, presentValue: 100 }],
          }}
          analyticsData={analyticsData}
        />,
      );

      const resultComponent = screen.getByText('Your results');
      expect(resultComponent).toBeInTheDocument();
    },
  );

  it('renders the balance breakdown table correctly', () => {
    render(
      <Results
        calculationResult={{
          monthlyPayment: 100,
          totalAmount: 100,
          interestSplit: 100,
          capitalSplit: 100,
          debt: 100,
          changedPayment: 100,
          balanceBreakdown: [
            { year: 1, presentValue: 50000 },
            { year: 2, presentValue: -1000 }, // Negative value to test zero display
          ],
        }}
        analyticsData={analyticsData}
      />,
    );

    const year1Row = screen.getByRole('cell', { name: 'Year 1' }).closest('tr');
    expect(year1Row?.children[1].textContent).toBe('£50,000');

    const year2Row = screen.getByRole('cell', { name: 'Year 2' }).closest('tr');
    expect(year2Row?.children[1].textContent).toBe('£0');
  });
});
