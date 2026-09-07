import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';
import { fireEvent, render, screen } from '@testing-library/react';

import { FirmsTable } from './FirmsTable';

import '@testing-library/jest-dom';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    pathname: '/admin/dashboard',
    push: mockPush,
  }),
}));

const firmWithPrincipal = createMockFirm({
  id: 'firm-1',
  fca_number: 610022,
  registered_name: 'Just Insurance Agents Limited',
  approved_at: '2024-10-16T09:21:00Z',
  reregistered_at: '2024-11-21T10:18:00Z',
  reregister_approved_at: '2024-12-24T11:19:00Z',
  principal: {
    first_name: 'Andrew',
    last_name: 'Jackson',
    job_title: null,
    email_address: null,
    telephone_number: null,
    confirmed_disclaimer: true,
    senior_manager_name: null,
    individual_reference_number: 'IRN001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
});

describe('FirmsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with column headers', () => {
    render(<FirmsTable firms={[]} />);
    const table = screen.getByTestId('firms-table');
    expect(table).toBeInTheDocument();
    expect(screen.getByText('FCA Number')).toBeInTheDocument();
    expect(screen.getByText('Firm name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Reregistered')).toBeInTheDocument();
    expect(screen.getByText('Reapproved')).toBeInTheDocument();
    expect(screen.getAllByTestId('sort-arrow')).toHaveLength(8);
  });

  it('renders FCA status labels in the Status column', () => {
    render(
      <FirmsTable
        firms={[
          createMockFirm({
            id: 'fca-invalid',
            status: 'hidden',
            hidden_reason: HIDDEN_DUE_TO_FCA,
          }),
          createMockTradingFirm({
            id: 'trading-invalid',
            status: 'hidden',
            hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
          }),
        ]}
      />,
    );

    expect(screen.getByText('No longer authorised')).toBeInTheDocument();
    expect(screen.getByText('No longer valid')).toBeInTheDocument();
  });

  it('renders empty state when no firms', () => {
    render(<FirmsTable firms={[]} />);
    expect(
      screen.getByText(
        'There are no matching results. Improve your search by checking your spelling or using fewer keywords.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Reset search' }),
    ).toBeInTheDocument();
  });

  it('resets search when clicking reset link', () => {
    render(<FirmsTable firms={[]} />);
    fireEvent.click(screen.getByRole('link', { name: 'Reset search' }));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/admin/dashboard',
      query: {},
    });
  });

  it('renders firm row with principal name and FCA number', () => {
    render(<FirmsTable firms={[firmWithPrincipal]} />);
    expect(screen.getByText('Andrew Jackson')).toBeInTheDocument();
    expect(screen.getByText('610022')).toBeInTheDocument();
  });

  it('renders firm name as a link', () => {
    render(<FirmsTable firms={[firmWithPrincipal]} />);
    const link = screen.getByText('Just Insurance Agents Limited');
    expect(link.closest('a')).toHaveAttribute('href', '/admin/firms/firm-1');
  });

  it('renders trading document name as subsidiary of main firm', () => {
    const tradingFirm = createMockTradingFirm({
      id: 'firm-3',
      fca_number: 610022,
      registered_name: 'Justtravelcover.com',
    });

    render(
      <FirmsTable
        firms={[tradingFirm]}
        mainRegisteredNameByFca={{
          '610022': 'Just Insurance Agents Limited',
        }}
      />,
    );

    const tradingLink = screen.getByRole('link', {
      name: 'Justtravelcover.com',
    });
    const mainLink = screen.getByRole('link', {
      name: 'Just Insurance Agents Limited',
    });
    expect(tradingLink).toHaveAttribute('href', '/admin/firms/firm-3');
    expect(mainLink).toHaveAttribute('href', '/admin/firms/firm-3');
    expect(screen.getAllByRole('link')).toHaveLength(2);
    const row = screen.getByTestId('firms-table-row');
    expect(row.textContent).toContain(' subsidiary of ');
  });

  it('renders trading name alone when main firm name is not in map', () => {
    const tradingFirm = createMockTradingFirm({
      id: 'firm-3',
      fca_number: 999999,
      registered_name: 'Justtravelcover.com',
    });

    render(<FirmsTable firms={[tradingFirm]} />);

    expect(
      screen.getByRole('link', { name: 'Justtravelcover.com' }),
    ).toHaveAttribute('href', '/admin/firms/firm-3');
  });

  it('formats dates correctly', () => {
    render(<FirmsTable firms={[firmWithPrincipal]} />);
    expect(screen.getByText('16 Oct 09:21')).toBeInTheDocument();
  });

  it('shows Not approved when approved_at is null', () => {
    const firmNotApproved = createMockFirm({
      id: 'firm-not-approved',
      approved_at: null,
      reregistered_at: null,
      reregister_approved_at: null,
    });
    render(<FirmsTable firms={[firmNotApproved]} />);
    expect(screen.getAllByText('Not approved')).toHaveLength(2);
    expect(screen.getByText('Not reregistered')).toBeInTheDocument();
  });

  it('shows dash for trading row when mainPrincipalByFca has no entry', () => {
    const firmNoPrincipal = createMockTradingFirm({
      id: 'firm-2',
      fca_number: 888888,
    });
    render(<FirmsTable firms={[firmNoPrincipal]} />);
    const rows = screen.getAllByTestId('firms-table-row');
    expect(rows[0]).toHaveTextContent('—');
  });

  it('shows inherited approved date for trading row', () => {
    const tradingFirm = createMockTradingFirm({
      id: 'firm-trading',
      fca_number: 610022,
      registered_name: 'Trading Brand',
      approved_at: null,
    });

    render(
      <FirmsTable
        firms={[tradingFirm]}
        mainApprovedAtByFca={{
          '610022': '2024-10-16T09:21:00Z',
        }}
      />,
    );

    expect(screen.getByText('16 Oct 09:21')).toBeInTheDocument();
  });

  it('shows inherited reregistered and reapproved dates for trading row', () => {
    const tradingFirm = createMockTradingFirm({
      id: 'firm-trading',
      fca_number: 610022,
      registered_name: 'Trading Brand',
    });

    render(
      <FirmsTable
        firms={[tradingFirm]}
        mainReregistrationByFca={{
          '610022': {
            reregistered_at: '2024-11-21T10:18:00Z',
            reregister_approved_at: '2024-12-24T11:19:00Z',
          },
        }}
      />,
    );

    expect(screen.getByText('21 Nov 10:18')).toBeInTheDocument();
    expect(screen.getByText('24 Dec 11:19')).toBeInTheDocument();
  });

  it('shows inherited principal for trading row when map is passed', () => {
    const mainPrincipal = firmWithPrincipal.principal;
    const tradingFirm = createMockTradingFirm({
      id: 'firm-trading',
      fca_number: 610022,
      registered_name: 'Trading Brand',
    });

    render(
      <FirmsTable
        firms={[tradingFirm]}
        mainPrincipalByFca={{ '610022': mainPrincipal }}
      />,
    );

    expect(screen.getByText('Andrew Jackson')).toBeInTheDocument();
  });

  it('triggers sort on column header click', () => {
    render(<FirmsTable firms={[firmWithPrincipal]} />);
    const fcaHeader = screen.getByText('FCA Number');
    fireEvent.click(fcaHeader);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/admin/dashboard',
      query: { sortBy: 'fcaNumber', sortDir: 'asc' },
    });
  });

  it('toggles sort direction when clicking active column', () => {
    render(
      <FirmsTable
        firms={[firmWithPrincipal]}
        sortBy="fcaNumber"
        sortDir="asc"
      />,
    );
    const fcaHeader = screen.getByText('FCA Number');
    const sortArrow = screen.getAllByTestId('sort-arrow')[0];
    expect(sortArrow).toHaveClass('rotate-180');
    fireEvent.click(fcaHeader);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/admin/dashboard',
      query: { sortBy: 'fcaNumber', sortDir: 'desc' },
    });
  });
});
