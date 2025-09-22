import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RetireAgeInput } from './RetireAgeInput';
import '@testing-library/jest-dom';

describe('RetireAgeInput', () => {
  const mockOnAgeChange = jest.fn();

  const defaultProps = {
    suffixField: 1,
    retireAge: '65',
    onAgeChange: mockOnAgeChange,
    inputClassName: 'custom-class',
    inputBackground: 'bg-white',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label and input correctly', () => {
    render(<RetireAgeInput {...defaultProps} />);
    expect(
      screen.getByLabelText(/I would like to retire at the age of/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/years/i)).toBeInTheDocument();
  });

  it('applies inputClassName and inputBackground styles', () => {
    const { container } = render(<RetireAgeInput {...defaultProps} />);
    const inputWrapper = container.querySelector('.custom-class');
    const input = container.querySelector('input');
    expect(inputWrapper).toBeInTheDocument();
    expect(input).toHaveClass('bg-white');
  });

  it('sets default value correctly', () => {
    render(<RetireAgeInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('65');
  });

  it('calls onAgeChange when input changes', () => {
    render(<RetireAgeInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '66' } });
    expect(mockOnAgeChange).toHaveBeenCalled();
  });

  it('allows valid age input (between 0 and 99)', () => {
    render(<RetireAgeInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '75' } });
    expect(mockOnAgeChange).toHaveBeenCalled();
  });

  it('blocks invalid age input (e.g., 100)', () => {
    render(<RetireAgeInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '100' } });
    expect(mockOnAgeChange).not.toHaveBeenCalled();
  });
});
