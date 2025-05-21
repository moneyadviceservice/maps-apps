import { render, screen } from '@testing-library/react';

import CompareAccounts from './CompareAccounts';
import { mockAccounts } from './mocks';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en', searchQuery: 'test' },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: jest.fn(({ en }) => en),
  }),
}));

describe('CompareAccounts Component', () => {
  it('renders correctly with the provided props', () => {
    const mockTotalItems = 2;

    render(
      <CompareAccounts accounts={mockAccounts} totalItems={mockTotalItems} />,
    );

    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('Provider 1')).toBeInTheDocument();
    expect(screen.getByText('Account 2')).toBeInTheDocument();
    expect(screen.getByText('Provider 2')).toBeInTheDocument();

    const backToTopLink = screen.getByText(/Back to top/i);
    expect(backToTopLink).toBeInTheDocument();
  });

  it('displays the last updated date when lastUpdated is provided', () => {
    const mockTotalItems = 5;
    const mockLastUpdated = '2025-01-31T12:00:00Z';

    render(
      <CompareAccounts
        accounts={mockAccounts}
        totalItems={mockTotalItems}
        lastUpdated={mockLastUpdated}
      />,
    );

    expect(
      screen.getByText(/Account information updated:/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/31\/1\/2025/i)).toBeInTheDocument();
  });
});
