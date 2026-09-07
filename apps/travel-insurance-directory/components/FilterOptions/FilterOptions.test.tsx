import { fireEvent, render, screen } from '@testing-library/react';

import { FilterOptions } from './FilterOptions';

import '@testing-library/jest-dom';

const mockUseIsLg = jest.fn();
jest.mock('hooks', () => ({
  useIsLg: () => mockUseIsLg(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (t: { en: string; cy: string }) => t.en,
  }),
}));

jest.mock('../FilterContent', () => ({
  FilterContent: ({
    query,
    idPrefix,
  }: {
    query: Record<string, unknown>;
    idPrefix: string;
  }) => (
    <div
      data-testid="filter-content"
      data-query={JSON.stringify(query)}
      data-id-prefix={idPrefix}
    >
      Filter content
    </div>
  ),
}));

describe('FilterOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsLg.mockReturnValue(true);
  });

  it('renders Filters heading and Clear all link', () => {
    render(<FilterOptions lang="en" query={{}} />);
    const headings = screen.getAllByRole('heading', { name: 'Filters' });
    expect(headings.length).toBeGreaterThanOrEqual(1);
    const link = screen.getByRole('link', { name: 'Clear all' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/listings');
  });

  it('uses lang in Clear all link href', () => {
    render(<FilterOptions lang="cy" query={{}} />);
    expect(screen.getByRole('link', { name: 'Clear all' })).toHaveAttribute(
      'href',
      '/cy/listings',
    );
  });

  it('renders FilterContent with query and idPrefix', () => {
    render(<FilterOptions lang="en" query={{ age: '30' }} />);
    const content = screen.getByTestId('filter-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-id-prefix', 'filters');
    expect(content).toHaveAttribute(
      'data-query',
      JSON.stringify({ age: '30' }),
    );
  });

  it('details is open when isLg is true', () => {
    mockUseIsLg.mockReturnValue(true);
    render(<FilterOptions lang="en" query={{}} />);
    const details = document.querySelector('details');
    expect(details).toHaveAttribute('open');
  });

  it('details is closed when isLg is false', () => {
    mockUseIsLg.mockReturnValue(false);
    render(<FilterOptions lang="en" query={{}} />);
    const details = document.querySelector('details');
    expect(details).not.toHaveAttribute('open');
  });

  it('toggling summary updates details open state', () => {
    mockUseIsLg.mockReturnValue(false);
    render(<FilterOptions lang="en" query={{}} />);
    const details = document.querySelector('details');
    const summary = details?.querySelector('summary');
    expect(details).not.toHaveAttribute('open');
    if (summary) {
      fireEvent.click(summary);
      expect(details).toHaveAttribute('open');
      fireEvent.click(summary);
      expect(details).not.toHaveAttribute('open');
    }
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <FilterOptions lang="en" query={{}} className="custom-class" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });
});
