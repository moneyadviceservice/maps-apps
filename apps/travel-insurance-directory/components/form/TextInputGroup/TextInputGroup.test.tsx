import { render, screen } from '@testing-library/react';

import { TextInputGroup } from './TextInputGroup';

jest.mock('components/form/FieldError', () => ({
  FieldError: ({
    children,
    fieldKey,
    className,
  }: {
    children: React.ReactNode;
    fieldKey: string;
    className?: string;
  }) => (
    <div data-testid={`field-error-${fieldKey}`} data-classname={className}>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: ({
    label,
    type,
    name,
    id,
    'data-testid': testId,
    className,
    defaultValue,
  }: {
    label: string;
    type: string;
    name: string;
    id: string;
    'data-testid'?: string;
    className?: string;
    defaultValue?: string;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        data-testid={testId}
        type={type}
        name={name}
        id={id}
        className={className}
        defaultValue={defaultValue}
      />
    </div>
  ),
}));

describe('TextInputGroup', () => {
  it('renders a list of text inputs inside their respective field error wrappers', () => {
    const mockInputs = [
      {
        key: 'firstName',
        title: 'First Name',
        type: 'text',
        defaultValue: 'John',
      },
      {
        key: 'email',
        title: 'Email Address',
        type: 'email',
        defaultValue: 'john@example.com',
      },
    ];

    render(<TextInputGroup inputs={mockInputs} />);

    mockInputs.forEach((input) => {
      const wrapper = screen.getByTestId(`field-error-${input.key}`);
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveAttribute('data-classname', 'mt-8');

      const inputElement = screen.getByTestId(input.key);
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).toHaveAttribute('type', input.type);
      expect(inputElement).toHaveAttribute('name', input.key);
      expect(inputElement).toHaveAttribute('id', input.key);
      expect(inputElement).toHaveClass('max-w-96');
      expect(inputElement).toHaveValue(input.defaultValue);

      expect(screen.getByText(input.title)).toBeInTheDocument();
    });
  });

  it('falls back to an empty string when defaultValue is null or undefined', () => {
    const mockInputs = [
      {
        key: 'middleName',
        title: 'Middle Name',
        type: 'text',
        defaultValue: null,
      },
      {
        key: 'lastName',
        title: 'Last Name',
        type: 'text',
      },
    ];

    render(<TextInputGroup inputs={mockInputs} />);

    const middleNameInput = screen.getByTestId('middleName');
    const lastNameInput = screen.getByTestId('lastName');

    expect(middleNameInput).toHaveValue('');
    expect(lastNameInput).toHaveValue('');
  });

  it('renders nothing cleanly when the inputs array is empty', () => {
    const { container } = render(<TextInputGroup inputs={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
