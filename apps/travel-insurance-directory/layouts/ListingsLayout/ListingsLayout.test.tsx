import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { fireEvent, render, screen } from '@testing-library/react';

import { ListingsLayout } from './ListingsLayout';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { language: 'en' },
    asPath: '/en/listings',
    push: jest.fn(),
    replace: jest.fn(),
    events: { on: jest.fn(), off: jest.fn() },
  }),
}));

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const defaultProps = {
  lang: 'en' as const,
  query: {},
  firms: [],
  pagination: null,
  showResultsSection: false,
};

describe('ListingsLayout', () => {
  it('renders form with listings-form test id', () => {
    render(<ListingsLayout {...defaultProps} />);
    expect(screen.getByTestId('listings-form')).toBeInTheDocument();
  });

  it('renders heading with expected text', () => {
    render(<ListingsLayout {...defaultProps} />);
    expect(
      screen.getByRole('heading', {
        name: 'Find a travel insurance provider if you have a serious medical condition or disability',
      }),
    ).toBeInTheDocument();
  });

  it('does not show results summary when showResultsSection is false', () => {
    render(<ListingsLayout {...defaultProps} />);
    expect(screen.queryByTestId('results-summary')).not.toBeInTheDocument();
  });

  it('shows results summary when showResultsSection is true and pagination is provided', () => {
    render(
      <ListingsLayout
        {...defaultProps}
        showResultsSection={true}
        pagination={{
          page: 1,
          totalPages: 2,
          totalItems: 10,
          itemsPerPage: 5,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 0,
          endIndex: 5,
        }}
      />,
    );
    expect(screen.getByTestId('results-summary')).toBeInTheDocument();
  });

  it('renders firm when firms array has items', () => {
    const firm = createMockFirm();
    render(<ListingsLayout {...defaultProps} firms={[firm]} />);
    expect(
      screen.getByText('Holiday Extras Cover Limited'),
    ).toBeInTheDocument();
  });

  it('calls onFormChange when form changes', () => {
    const onFormChange = jest.fn();
    render(
      <ListingsLayout
        {...defaultProps}
        showResultsSection={true}
        pagination={{
          page: 1,
          totalPages: 2,
          totalItems: 10,
          itemsPerPage: 5,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 0,
          endIndex: 5,
        }}
        onFormChange={onFormChange}
      />,
    );
    const limitSelect = screen.getByRole('combobox', {
      name: 'Items per page',
    });
    fireEvent.change(limitSelect, { target: { name: 'limit', value: '10' } });
    expect(onFormChange).toHaveBeenCalled();
  });
});
