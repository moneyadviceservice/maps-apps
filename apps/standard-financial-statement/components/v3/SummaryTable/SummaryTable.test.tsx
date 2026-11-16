import { render, screen } from '@testing-library/react';

import { SummaryTable, SummaryTableItem } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const summaryTableItems = [
  {
    type: 'income',
    text: 'Monthly Income Total',
    amount: 1948.81,
    changeLink: { href: '#' },
  },
  {
    type: 'outgoing',
    text: 'Monthly Outgoings (Fixed)',
    amount: 1540.98,
    changeLink: { href: '#' },
  },
  {
    type: 'outgoing',
    text: 'Monthly Outgoings (Flexible)',
    amount: 120.0,
    changeLink: { href: '#' },
  },
  {
    type: 'outgoing',
    text: 'Monthly Savings',
    amount: 100.0,
    changeLink: { href: '#' },
  },
  {
    type: 'outgoing',
    text: 'Debt Administration Fee',
    amount: 34.5,
    changeLink: { href: '#' },
  },
] as SummaryTableItem[];

describe('SummaryTable component', () => {
  it('renders correctly', () => {
    render(
      <SummaryTable
        captionText={'Summary table'}
        totalText={'Total Available for Creditors'}
        className="mb-10 lg:mb-12"
        items={summaryTableItems}
      />,
    );

    const table = screen.getByTestId('summary-table');

    expect(table).toMatchSnapshot();
  });

  it('calculates the total amount correctly', () => {
    render(
      <SummaryTable
        captionText={'Summary table'}
        totalText={'Total Available for Creditors'}
        className="mb-10 lg:mb-12"
        items={summaryTableItems}
      />,
    );

    const totalAmount = screen.getByTestId('summary-table-total-amount');

    expect(totalAmount).toHaveTextContent('£153.33');
  });
});
