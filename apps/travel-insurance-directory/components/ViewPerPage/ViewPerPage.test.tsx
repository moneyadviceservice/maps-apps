import { fireEvent, render, screen } from '@testing-library/react';

import { ViewPerPage } from './ViewPerPage';

import '@testing-library/jest-dom';

const mockPush = jest.fn();
const mockRouter = {
  query: { language: 'en' as string },
  asPath: '/en/listings',
  push: mockPush,
  replace: jest.fn(),
  events: { on: jest.fn(), off: jest.fn() },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

describe('ViewPerPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders with view-per-page test id', () => {
    render(<ViewPerPage query={{}} />);
    expect(screen.getByTestId('view-per-page')).toBeInTheDocument();
  });

  it('renders View per page label', () => {
    render(<ViewPerPage query={{}} />);
    expect(screen.getByText('View per page')).toBeInTheDocument();
  });

  it('renders select with listings-limit id', () => {
    render(<ViewPerPage query={{}} />);
    expect(document.getElementById('listings-limit')).toBeInTheDocument();
  });

  it('uses default limit 5 when query has no limit', () => {
    render(<ViewPerPage query={{}} />);
    const select = screen.getByRole('combobox', { name: 'Items per page' });
    expect(select).toHaveValue('5');
  });

  it('uses limit from query when provided', () => {
    render(<ViewPerPage query={{ limit: '10' }} />);
    const select = screen.getByRole('combobox', { name: 'Items per page' });
    expect(select).toHaveValue('10');
  });

  it('has options 5, 10, 20', () => {
    render(<ViewPerPage query={{}} />);
    expect(
      screen.getByRole('combobox', { name: 'Items per page' }),
    ).toBeInTheDocument();
  });

  it('calls router.push with new limit when select value changes', () => {
    render(<ViewPerPage query={{}} />);
    const select = screen.getByRole('combobox', {
      name: 'Items per page',
    });
    fireEvent.change(select, { target: { value: '20' } });
    expect(mockPush).toHaveBeenCalledWith(
      '/en/listings?limit=20&p=1',
      undefined,
      { scroll: false },
    );
  });

  it('uses basePath from router.asPath when changing limit', () => {
    mockRouter.asPath = '/en/listings?p=2';
    render(<ViewPerPage query={{ p: '2' }} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Items per page' }), {
      target: { value: '10' },
    });
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/en/listings'),
      undefined,
      { scroll: false },
    );
    const [url] = mockPush.mock.calls[0];
    expect(url).toContain('limit=10');
    expect(url).toContain('p=1');
    mockRouter.asPath = '/en/listings';
  });
});
