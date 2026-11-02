import { render, screen, fireEvent } from '@testing-library/react';
import { RetireAgeInput } from './RetireAgeInput';
import '@testing-library/jest-dom';
import useTranslation from '@maps-react/hooks/useTranslation';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;
describe('RetireAgeInput', () => {
  const mockOnAgeChange = jest.fn();

  const defaultProps = {
    suffixField: 1,
    retireAge: '65',
    onAgeChange: mockOnAgeChange,
    inputClassName: 'custom-class',
    inputBackground: 'bg-white',
    formErrors: undefined,
  };
  const errors = {
    id: '',
    name: '',
    gender: '',
    dob: '',
    retireAge: 'retire-age-range',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: { [key: string]: string } = {
          'aboutYou.retireAge.labelText':
            'I would like to retire at the age of:',
          'aboutYou.retireAge.suffix': 'years',
          'aboutYou.errors.retire-age-range':
            'Enter the age you’d like to retire, from 55 to 99. This can be your current age or older.',
        };
        return translations[key] || key;
      },
    });
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

  it('allows valid age input (between 55 and 99)', () => {
    render(<RetireAgeInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '70' } });
    expect(mockOnAgeChange).toHaveBeenCalled();
  });

  it('blocks invalid age input (e.g., 100)', () => {
    render(<RetireAgeInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '100' } });
    expect(mockOnAgeChange).not.toHaveBeenCalled();
  });
  it('displays error message when there is a retireAge error', () => {
    render(<RetireAgeInput {...defaultProps} formErrors={errors} />);
    expect(
      screen.getByText(
        'Enter the age you’d like to retire, from 55 to 99. This can be your current age or older.',
      ),
    ).toBeInTheDocument();
  });

  it('highlights input when there is a retireAge error', () => {
    render(<RetireAgeInput {...defaultProps} formErrors={errors} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-700');
  });

  it('does not highlight input when there are no retireAge errors', () => {
    render(<RetireAgeInput {...defaultProps} formErrors={undefined} />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveClass('border-red-700');
  });
});
