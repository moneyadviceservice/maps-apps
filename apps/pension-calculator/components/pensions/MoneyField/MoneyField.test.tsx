import { fireEvent, render, screen } from '@testing-library/react';

import { MoneyField } from './MoneyField';

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@maps-react/form/components/MoneyInput', () => ({
  MoneyInput: ({
    id,
    name,
    value,
    onChange,
    'aria-invalid': ariaInvalid,
  }: {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    'aria-invalid': boolean;
  }) => (
    <input
      id={id}
      name={name}
      data-testid="money-input"
      value={value}
      onChange={onChange}
      aria-invalid={ariaInvalid}
    />
  ),
}));

describe('MoneyField Component', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
    value: '100',
    onChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders label and input with initial value', () => {
    render(<MoneyField {...defaultProps} />);

    expect(screen.getByLabelText(defaultProps.label)).toBeInTheDocument();
    expect(screen.getByTestId('money-input')).toHaveValue('100');
  });

  test.each([
    ['present', 'Invalid value', 'true', 'Invalid value'],
    ['absent', undefined, 'false', null],
  ])(
    'handles error state correctly when error prop is %s',
    (_, errorProp, expectedAriaInvalid, expectedErrorText) => {
      render(<MoneyField {...defaultProps} error={errorProp} />);

      const input = screen.getByTestId('money-input');
      expect(input).toHaveAttribute('aria-invalid', expectedAriaInvalid);

      if (expectedErrorText) {
        expect(screen.getByText(expectedErrorText)).toBeInTheDocument();
      } else {
        expect(screen.queryByText('Invalid value')).not.toBeInTheDocument();
      }
    },
  );

  test('calls onChange callback with updated string value', () => {
    const onChangeMock = jest.fn();
    render(<MoneyField {...defaultProps} onChange={onChangeMock} />);

    const input = screen.getByTestId('money-input');
    fireEvent.change(input, { target: { value: '250' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('250');
  });
});
