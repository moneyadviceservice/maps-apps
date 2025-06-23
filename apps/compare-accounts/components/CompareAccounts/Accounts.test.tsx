import { render, screen } from '@testing-library/react';

import Accounts from './Accounts';
import { mockAccounts } from './mocks';

import '@testing-library/jest-dom';

jest.mock('./Account', () => {
  const MockAccount = ({
    account,
  }: {
    account: { id: string; name: string };
  }) => <div data-testid={`account-${account.id}`}>{account.name}</div>;
  MockAccount.displayName = 'MockAccount';
  return MockAccount;
});

describe('Accounts component', () => {
  it('renders list of accounts', () => {
    render(
      <Accounts accounts={mockAccounts} totalItems={mockAccounts.length} />,
    );

    // Ensure each account is rendered
    mockAccounts.forEach((account) => {
      const accountElement = screen.getByTestId(`account-${account.id}`);
      expect(accountElement).toBeInTheDocument();
      expect(accountElement).toHaveTextContent(account.name);
    });
  });

  it('displays "no results" message when totalItems is 0', () => {
    render(<Accounts accounts={[]} totalItems={0} />);

    // Ensure the "no results" message is displayed
    const noResultsMessage = screen.getByText(/There are no results/);
    expect(noResultsMessage).toBeInTheDocument();
  });

  it('displays "reset the filters" link when totalItems is 0', () => {
    render(<Accounts accounts={[]} totalItems={0} />);

    const resetLink = screen.getByText(/reset the filters/);
    expect(resetLink).toBeInTheDocument();
    expect(resetLink).toHaveAttribute('href', '?');
  });

  it('renders account names correctly', () => {
    render(
      <Accounts accounts={mockAccounts} totalItems={mockAccounts.length} />,
    );

    mockAccounts.forEach((account) => {
      const accountElement = screen.getByTestId(`account-${account.id}`);
      expect(accountElement).toHaveTextContent(account.name);
    });
  });

  it('does not display "no results" message when accounts are available', () => {
    render(
      <Accounts accounts={mockAccounts} totalItems={mockAccounts.length} />,
    );

    const noResultsMessage = screen.queryByText(/There are no results/);
    expect(noResultsMessage).not.toBeInTheDocument();
  });

  it('renders correct number of account elements', () => {
    render(
      <Accounts accounts={mockAccounts} totalItems={mockAccounts.length} />,
    );

    const accountElements = screen.getAllByTestId(/account-/);
    expect(accountElements.length).toBe(mockAccounts.length);
  });

  test('does not display "no results" message when there are accounts', () => {
    render(
      <Accounts accounts={mockAccounts} totalItems={mockAccounts.length} />,
    );

    const noResultsMessage = screen.queryByText(/There are no results/);
    expect(noResultsMessage).not.toBeInTheDocument();
  });
});
