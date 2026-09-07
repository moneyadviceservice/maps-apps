import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { fireEvent, render, screen } from '@testing-library/react';

import { ListingsLayout } from './ListingsLayout';

import '@testing-library/jest-dom';

const mockAddEvent = jest.fn();

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ addEvent: mockAddEvent }),
}));

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
  beforeEach(() => {
    mockAddEvent.mockClear();
  });

  it('renders form with listings-form test id and filter-menu id', () => {
    render(<ListingsLayout {...defaultProps} />);
    const form = screen.getByTestId('listings-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('id', 'filter-menu');
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

  it('renders medical screening banner once when firms are listed', () => {
    const firm = createMockFirm();
    render(<ListingsLayout {...defaultProps} firms={[firm]} />);
    expect(
      screen.getByTestId('callout-warning-medical-screening-banner'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /If you are going to get quotes from different providers, try and use firms that use different medical screening companies/,
      ),
    ).toBeInTheDocument();
  });

  it('does not render medical screening banner when no firms and not loading', () => {
    render(<ListingsLayout {...defaultProps} firms={[]} />);
    expect(
      screen.queryByTestId('callout-warning-medical-screening-banner'),
    ).not.toBeInTheDocument();
  });

  it('renders medical screening banner when filter loading', () => {
    const firm = createMockFirm();
    render(
      <ListingsLayout
        {...defaultProps}
        firms={[firm]}
        isFilterLoading={true}
      />,
    );
    expect(
      screen.getByTestId('callout-warning-medical-screening-banner'),
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
    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('pushes filterInteraction to analytics when a directory filter changes', () => {
    const onFormChange = jest.fn();
    render(
      <ListingsLayout
        {...defaultProps}
        showResultsSection={true}
        pagination={{
          page: 1,
          totalPages: 1,
          totalItems: 5,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 0,
          endIndex: 5,
        }}
        onFormChange={onFormChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: /0 - 16/i });
    fireEvent.click(checkbox);
    expect(mockAddEvent).toHaveBeenCalledTimes(1);
    expect(mockAddEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'filterInteraction',
        eventInfo: expect.objectContaining({
          interactionType: 'filterSelect',
          filter: expect.objectContaining({
            category: 'Age at time of travel',
            value: '0-16',
            selectedFilters: expect.arrayContaining([
              expect.objectContaining({
                category: 'Age at time of travel',
                values: ['0-16'],
              }),
            ]),
          }),
        }),
        page: expect.objectContaining({
          pageName: 'travel-insurance-directory--firm-listings',
        }),
        tool: expect.objectContaining({
          toolName: 'Travel Insurance Directory',
          toolStep: '3',
        }),
      }),
    );
    expect(onFormChange).toHaveBeenCalled();
  });

  it('shows download link when results section is shown and there are firms', () => {
    render(
      <ListingsLayout
        {...defaultProps}
        showResultsSection={true}
        pagination={{
          page: 1,
          totalPages: 1,
          totalItems: 5,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 0,
          endIndex: 5,
        }}
      />,
    );
    const link = screen.getByTestId('download-all-firms');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/api/listings/export-firms?'),
    );
    expect(link).toHaveAttribute('download', 'travel-insurance-firms.pdf');
    expect(link).toHaveTextContent('Download a list of all firms');
  });

  it('pushes fileDownload to analytics when the export link is clicked', () => {
    render(
      <ListingsLayout
        {...defaultProps}
        showResultsSection={true}
        pagination={{
          page: 1,
          totalPages: 1,
          totalItems: 5,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 0,
          endIndex: 5,
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('download-all-firms'));
    expect(mockAddEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'fileDownload',
        eventInfo: {
          file: { name: 'travel-insurance-firms.pdf', type: 'pdf' },
          product: 'Travel Insurance Directory',
        },
        page: expect.objectContaining({
          pageName: 'travel-insurance-directory--firm-listings',
        }),
        tool: expect.objectContaining({
          toolName: 'Travel Insurance Directory',
          toolStep: '3',
        }),
      }),
    );
  });

  it('does not show download link when totalItems is 0', () => {
    render(
      <ListingsLayout
        {...defaultProps}
        showResultsSection={true}
        pagination={{
          page: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 0,
          endIndex: 0,
        }}
      />,
    );
    expect(screen.queryByTestId('download-all-firms')).not.toBeInTheDocument();
  });

  it('shows loading skeletons instead of firms when isFilterLoading', () => {
    const firm = createMockFirm();
    render(
      <ListingsLayout
        {...defaultProps}
        firms={[firm]}
        isFilterLoading={true}
      />,
    );
    expect(
      screen.queryByText('Holiday Extras Cover Limited'),
    ).not.toBeInTheDocument();
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThanOrEqual(5);
  });
});
