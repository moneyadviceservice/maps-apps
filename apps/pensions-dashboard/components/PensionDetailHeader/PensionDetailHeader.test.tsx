import { render, screen } from '@testing-library/react';

import { PensionArrangement } from '../../lib/types';
import { PensionDetailHeader } from './PensionDetailHeader';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: {},
    pathname: '/pension-detail',
  })),
}));

const mockPensionData: PensionArrangement = {
  contactReference: 'REF123456',
  retirementDate: '2026-01-01',
} as PensionArrangement;

describe('PensionDetailHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders plan reference number', () => {
    render(<PensionDetailHeader data={mockPensionData} />);
    expect(screen.getByTestId('reference-number')).toHaveTextContent(
      `Plan reference number: REF123456`,
    );

    const retirementDateElement = screen.getByTestId('retirement-date');
    expect(retirementDateElement).toContainHTML('1 January 2026');
  });

  it('renders Unavailable when values are undefined', () => {
    const dataWithoutValues = {
      ...mockPensionData,
      contactReference: undefined,
      retirementDate: undefined,
    };

    render(<PensionDetailHeader data={dataWithoutValues} />);

    expect(screen.getByTestId('reference-number')).toHaveTextContent(
      `Plan reference number: Unavailable`,
    );

    const retirementDateElement = screen.getByTestId('retirement-date');
    expect(retirementDateElement).toContainHTML('Unavailable');
  });

  it('renders tabs', () => {
    render(<PensionDetailHeader data={mockPensionData} />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });
});
