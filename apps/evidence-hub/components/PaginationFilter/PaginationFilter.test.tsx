import { fireEvent, render, screen } from '@testing-library/react';

import { PaginationFilter } from './PaginationFilter';

import '@testing-library/jest-dom';

describe('PaginationFilter', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default value', () => {
    render(<PaginationFilter value={20} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('20');
  });

  it('should render all page size options', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option'));

    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('10 per page');
    expect(options[1]).toHaveTextContent('20 per page');
    expect(options[2]).toHaveTextContent('30 per page');
    expect(options[3]).toHaveTextContent('40 per page');
    expect(options[4]).toHaveTextContent('50 per page');
  });

  it('should call onChange when selection changes', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '30' } });

    expect(mockOnChange).toHaveBeenCalledWith(30);
  });

  it('should call onChange with correct value for each option', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');

    // Test each option
    fireEvent.change(select, { target: { value: '10' } });
    expect(mockOnChange).toHaveBeenCalledWith(10);

    fireEvent.change(select, { target: { value: '20' } });
    expect(mockOnChange).toHaveBeenCalledWith(20);

    fireEvent.change(select, { target: { value: '30' } });
    expect(mockOnChange).toHaveBeenCalledWith(30);

    fireEvent.change(select, { target: { value: '40' } });
    expect(mockOnChange).toHaveBeenCalledWith(40);

    fireEvent.change(select, { target: { value: '50' } });
    expect(mockOnChange).toHaveBeenCalledWith(50);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <PaginationFilter
        value={10}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(
      <PaginationFilter
        value={10}
        onChange={mockOnChange}
        data-testid="pagination-filter"
      />,
    );

    const select = screen.getByTestId('pagination-filter');
    expect(select).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-label', 'Select items per page');
  });

  it('should not show empty placeholder option', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option'));

    // Should not have any disabled/hidden placeholder options
    const emptyOptions = options.filter(
      (option) =>
        option.hasAttribute('disabled') || option.hasAttribute('hidden'),
    );
    expect(emptyOptions).toHaveLength(0);
  });

  it('should handle value changes correctly', () => {
    const { rerender } = render(
      <PaginationFilter value={10} onChange={mockOnChange} />,
    );

    let select = screen.getByRole('combobox');
    expect(select).toHaveValue('10');

    rerender(<PaginationFilter value={30} onChange={mockOnChange} />);
    select = screen.getByRole('combobox');
    expect(select).toHaveValue('30');
  });

  it('should have correct styling classes', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('h-10', 'min-w-[140px]');
  });

  it('should set name attribute for form submission', () => {
    render(
      <PaginationFilter value={10} onChange={mockOnChange} name="limit" />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'limit');
  });

  it('should work without name attribute', () => {
    render(<PaginationFilter value={10} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).not.toHaveAttribute('name');
  });
});
