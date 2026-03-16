import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PartnerDob } from './PartnerDOB';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';
const mockTranslation: Record<string, string> = {
  'aboutYou.dob.labelText': 'Date of birth',
  'aboutYou.dob.day': 'Day',
  'aboutYou.dob.month': 'Month',
  'aboutYou.dob.year': 'Year',
  'aboutYou.errors.dob-empty': 'Date of birth is required',
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => mockTranslation[key] || key,
  }),
}));

jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: ({ label, ...props }: any) => (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input {...props} />
    </div>
  ),
}));

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('lib/validation/partner', () => ({
  getErrorMessageByKey: jest.fn(),
  hasFieldError: jest.fn(),
}));

describe('PartnerDob', () => {
  const defaultProps = {
    idSuffix: 1,
    dob: { day: '12', month: '5', year: '1990' },
    formErrors: null,
    onDobChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all inputs and labels correctly', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue('');
    (hasFieldError as jest.Mock).mockReturnValue([]);

    render(<PartnerDob {...defaultProps} />);

    expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Day')).toHaveValue(12);
    expect(screen.getByLabelText('Month')).toHaveValue(5);
    expect(screen.getByLabelText('Year')).toHaveValue(1990);
  });

  it('displays error message when dob has error', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue('dob-empty');
    (hasFieldError as jest.Mock).mockReturnValue(['dob-empty']);

    render(<PartnerDob {...defaultProps} />);

    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
  });

  it('applies red border class when day has error', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue('day-invalid');
    (hasFieldError as jest.Mock).mockReturnValue(['day-invalid']);

    render(<PartnerDob {...defaultProps} />);

    const dayInput = screen.getByLabelText('Day');
    expect(dayInput.className).toContain('border-red-700');
  });

  it('calls onDobChange when inputs change', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue('');
    (hasFieldError as jest.Mock).mockReturnValue([]);

    render(<PartnerDob {...defaultProps} />);

    const dayInput = screen.getByLabelText('Day');
    fireEvent.change(dayInput, { target: { value: '15' } });

    expect(defaultProps.onDobChange).toHaveBeenCalled();
  });

  it('handles missing dob values gracefully', () => {
    const props = { ...defaultProps, dob: { day: '', month: '', year: '' } };
    (getErrorMessageByKey as jest.Mock).mockReturnValue('');
    (hasFieldError as jest.Mock).mockReturnValue([]);

    render(<PartnerDob {...props} />);

    expect(screen.getByLabelText('Day')).toHaveValue(null);
    expect(screen.getByLabelText('Month')).toHaveValue(null);
    expect(screen.getByLabelText('Year')).toHaveValue(null);
  });
});
