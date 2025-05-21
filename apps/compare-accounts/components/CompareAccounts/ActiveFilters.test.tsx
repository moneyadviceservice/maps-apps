import { render, screen } from '@testing-library/react';

import ActiveFilters from './ActiveFilters';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {
      accountsPerPage: '5',
      feefreebasicbank: 'on',
      language: 'en',
      order: 'monthlyAccountFeeLowestFirst',
      standardcurrent: 'on',
      premier: 'on',
      chequebookavailable: 'on',
      opentonewcustomers: 'on',
      branchbanking: 'on',
      mobileappbanking: 'on',
    },
    pathname: '/compare-accounts',
    push: jest.fn(),
  }),
}));

describe('ActiveFilters', () => {
  it('displays active filters based on query params', () => {
    render(<ActiveFilters />);

    expect(screen.getByText('Standard current')).toBeInTheDocument();
    expect(screen.getByText('Fee-free basic')).toBeInTheDocument();
    expect(screen.getByText('Premier')).toBeInTheDocument();
    expect(screen.getByText('Cheque book available')).toBeInTheDocument();
    expect(screen.getByText('Open to new customers')).toBeInTheDocument();
    expect(screen.getByText('Branch banking')).toBeInTheDocument();
    expect(screen.getByText('Mobile app banking')).toBeInTheDocument();
  });
});
