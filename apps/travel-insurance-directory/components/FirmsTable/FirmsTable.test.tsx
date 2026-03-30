import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { render, screen, fireEvent } from '@testing-library/react';

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
  principals: [
    {
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
  ],
});

describe('FirmsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with column headers', () => {
    render(<FirmsTable firms={[]} />);
    const table = screen.getByTestId('firms-table');
    expect(table).toBeInTheDocument();
    expect(
      screen.getByText('Principal First Name and Last Name'),
    ).toBeInTheDocument();
    expect(screen.getByText('FCA Number')).toBeInTheDocument();
    expect(screen.getByText('Firm Registered Name')).toBeInTheDocument();
    expect(screen.getByText('Reregistered')).toBeInTheDocument();
    expect(screen.getByText('Reapproved')).toBeInTheDocument();
  });

  it('renders empty state when no firms', () => {
    render(<FirmsTable firms={[]} />);
    expect(screen.getByText('No firms found.')).toBeInTheDocument();
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

  it('formats dates correctly', () => {
    render(<FirmsTable firms={[firmWithPrincipal]} />);
    expect(screen.getByText('16 Oct 09:21')).toBeInTheDocument();
  });

  it('shows dash for missing principal', () => {
    const firmNoPrincipal = createMockFirm({
      id: 'firm-2',
      principals: [],
    });
    render(<FirmsTable firms={[firmNoPrincipal]} />);
    const rows = screen.getAllByTestId('firms-table-row');
    expect(rows[0]).toHaveTextContent('—');
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
    fireEvent.click(fcaHeader);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/admin/dashboard',
      query: { sortBy: 'fcaNumber', sortDir: 'desc' },
    });
  });
});
