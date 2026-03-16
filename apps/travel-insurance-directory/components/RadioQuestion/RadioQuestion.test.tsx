import { useErrorSummary } from 'hooks/useErrorSummary';
import { render, screen } from '@testing-library/react';

import { RadioInput, RadioQuestion } from './RadioQuestion';

jest.mock('hooks/useErrorSummary');
const mockedUseErrorSummary = useErrorSummary as jest.MockedFunction<
  typeof useErrorSummary
>;

const mockRadioInput: RadioInput = {
  key: 'testRadio',
  title: 'Choose an option',
  layout: 'column',
  options: [
    { label: 'Yes', value: 'yes', hintText: 'This is a hint' },
    { label: 'No', value: 'no' },
  ],
};

describe('RadioQuestion', () => {
  beforeEach(() => {
    mockedUseErrorSummary.mockReturnValue({
      setFormSummaryErrors: jest.fn(),
      setSubmittedEmail: jest.fn(),
      errorSummarySection: null,
      fieldErrors: null,
    });
  });

  it('renders all options with correct labels', () => {
    render(<RadioQuestion radioInput={mockRadioInput} initialValue="" />);

    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  it('renders hint text only for options that provide it', () => {
    render(<RadioQuestion radioInput={mockRadioInput} initialValue="" />);

    expect(screen.getByText('This is a hint')).toBeInTheDocument();
    expect(screen.queryByTestId('hint-no')).not.toBeInTheDocument();
  });

  it('checks the correct radio button based on initialValue', () => {
    render(<RadioQuestion radioInput={mockRadioInput} initialValue="yes" />);

    const yesRadio = screen.getByLabelText(
      'Yes',
    ) as unknown as HTMLInputElement;
    const noRadio = screen.getByLabelText('No') as unknown as HTMLInputElement;

    expect(yesRadio.checked).toBe(true);
    expect(noRadio.checked).toBe(false);
  });

  it('applies error styling when fieldErrors contains the input key', () => {
    mockedUseErrorSummary.mockReturnValue({
      setFormSummaryErrors: jest.fn(),
      setSubmittedEmail: jest.fn(),
      errorSummarySection: null,
      fieldErrors: {
        testRadio: ['This field is required'],
      },
    });

    render(<RadioQuestion radioInput={mockRadioInput} initialValue="" />);

    const radioInput = screen.getByTestId('radio-input-yes');

    expect(radioInput).toBeInTheDocument();
  });

  it('applies row layout class when specified', () => {
    const rowInput: RadioInput = { ...mockRadioInput, layout: 'row' };
    const { container } = render(
      <RadioQuestion radioInput={rowInput} initialValue="" />,
    );

    expect(container.firstChild).toHaveClass('flex-row');
  });
});
