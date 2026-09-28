import { render, screen } from '@testing-library/react';

import { SortFilter } from './SortFilter';

import '@testing-library/jest-dom';

describe('SortFilter', () => {
  it('should render with default options when hasKeyword is false', () => {
    render(<SortFilter value="published" hasKeyword={false} />);

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option'));

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Published Date');
    expect(options[1]).toHaveTextContent('Recently Uploaded');
    expect(screen.getByText('Sort results by')).toBeInTheDocument();
  });

  it('should render with relevance option when hasKeyword is true', () => {
    render(<SortFilter value="relevance" hasKeyword={true} />);

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option'));

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Relevance');
    expect(options[1]).toHaveTextContent('Published Date');
    expect(options[2]).toHaveTextContent('Recently Uploaded');
  });

  it('should display the current value correctly', () => {
    render(<SortFilter value="published" hasKeyword={false} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('published');
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <SortFilter
        value="published"
        hasKeyword={false}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should set correct data-testid when provided', () => {
    render(
      <SortFilter
        value="published"
        hasKeyword={false}
        data-testid="sort-filter"
      />,
    );

    const select = screen.getByTestId('sort-filter');
    expect(select).toBeInTheDocument();
  });

  it('should have correct name attribute for form submission', () => {
    render(<SortFilter value="published" hasKeyword={false} name="order" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'order');
  });

  it('should have proper accessibility attributes', () => {
    render(<SortFilter value="published" hasKeyword={false} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-label', 'Sort results by');
  });

  it('should not show empty placeholder option', () => {
    render(<SortFilter value="published" hasKeyword={false} />);

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option'));

    const emptyOptions = options.filter(
      (option) =>
        option.hasAttribute('disabled') || option.hasAttribute('hidden'),
    );
    expect(emptyOptions).toHaveLength(0);
  });

  it('should handle value changes correctly', () => {
    const { rerender } = render(
      <SortFilter value="published" hasKeyword={false} />,
    );

    let select = screen.getByRole('combobox');
    expect(select).toHaveValue('published');

    rerender(<SortFilter value="updated" hasKeyword={false} />);
    select = screen.getByRole('combobox');
    expect(select).toHaveValue('updated');
  });

  it('should have correct styling classes', () => {
    render(<SortFilter value="published" hasKeyword={false} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('min-w-[180px]');
  });
});
