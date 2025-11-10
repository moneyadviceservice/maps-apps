import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PartnerName } from './PartnerName';
import { hasFieldError, getErrorMessageByKey } from 'lib/validation/partner';
import { useTranslation } from '@maps-react/hooks/useTranslation';

jest.mock('lib/validation/partner', () => ({
  hasFieldError: jest.fn(),
  getErrorMessageByKey: jest.fn(),
}));
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (k: string) => k,
    z: (_: any, __?: any) => '',
    tList: (_: string) => [],
    locale: 'en',
  })),
}));
jest.mock('@maps-react/common/components/Button', () => ({
  Button: (props: any) => {
    const {
      children,
      'data-testid': dataTestId,
      formAction,
      onClick,
      name,
      value,
      className,
      type,
      variant,
      ...rest
    } = props;
    return (
      <button
        data-testid={dataTestId || `mock-button-${name || ''}-${value || ''}`}
        data-formaction={formAction}
        data-variant={variant}
        data-type={type}
        data-name={name}
        data-value={value}
        className={className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  },
}));
jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ errors, children }: any) => (
    <div data-errors={JSON.stringify(errors || [])}>{children}</div>
  ),
}));
jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: ({ children }: any) => <h3>{children}</h3>,
}));
jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: (props: any) => {
    const { id, name, value, onChange, className } = props;
    return (
      <input
        data-testid={`mock-textinput-${id}`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        readOnly={typeof onChange !== 'function'}
      />
    );
  },
}));

describe('PartnerName component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hasFieldError as jest.Mock).mockImplementation(() => []);
    (getErrorMessageByKey as jest.Mock).mockImplementation(() => '');
    (useTranslation as jest.Mock).mockImplementation(() => ({
      t: (k: string) => k,
      z: (_: any, __?: any) => '',
      tList: (_: string) => [],
      locale: 'en',
    }));
  });

  it('renders name and edit button when not editing and no errors', () => {
    render(
      <PartnerName
        id={1}
        name="Alice Partner"
        editing={false}
        formErrors={null}
        onChange={jest.fn()}
        onEdit={jest.fn().mockResolvedValue(undefined)}
        onDone={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Alice Partner',
    );

    const editBtn = screen.getByTestId('edit_name_button_1');
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveAttribute(
      'data-formaction',
      '/api/about-you?edit=1&id=1&',
    );
    expect(editBtn).toHaveTextContent('aboutYou.name.editLink');
  });

  it('shows error message and flags when there is a name error and includes error in edit formAction', () => {
    (hasFieldError as jest.Mock).mockImplementation(() => ['name']);
    (getErrorMessageByKey as jest.Mock).mockImplementation(() => 'required');

    render(
      <PartnerName
        id={2}
        name="Bob"
        editing={false}
        formErrors={{ name: 'error' }}
        onChange={jest.fn()}
        onEdit={jest.fn().mockResolvedValue(undefined)}
        onDone={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    const errorsContainer = document.querySelector(
      '[data-errors]',
    ) as HTMLElement;
    expect(errorsContainer).toHaveAttribute(
      'data-errors',
      JSON.stringify(['name']),
    );
    expect(screen.getByText('aboutYou.errors.required')).toBeInTheDocument();
    const editBtn = screen.getByTestId('edit_name_button_2');
    expect(editBtn).toHaveAttribute(
      'data-formaction',
      '/api/about-you?edit=1&id=2&error=name',
    );
  });

  it('renders input and update button when editing; shows red border when error present', () => {
    (hasFieldError as jest.Mock).mockImplementation(() => ['name']);
    (getErrorMessageByKey as jest.Mock).mockImplementation(() => 'required');

    const handleChange = jest.fn();

    render(
      <PartnerName
        id={3}
        name="Charlie"
        editing={true}
        formErrors={{ name: 'bad' }}
        onChange={handleChange}
        onEdit={jest.fn().mockResolvedValue(undefined)}
        onDone={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    const input = screen.getByTestId('mock-textinput-name_3');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Charlie');
    expect(input).toHaveClass('border-red-700');

    const updateBtn = screen.getByTestId('mock-button-action-update');
    expect(updateBtn).toBeInTheDocument();
    expect(updateBtn).toHaveAttribute('data-formaction', '/api/about-you?id=3');
    expect(updateBtn).toHaveTextContent('aboutYou.name.editButton');
  });

  it('calls onChange when typing in the input', () => {
    (hasFieldError as jest.Mock).mockImplementation(() => []);
    (getErrorMessageByKey as jest.Mock).mockImplementation(() => '');

    const handleChange = jest.fn();
    render(
      <PartnerName
        id={4}
        name="Dana"
        editing={true}
        formErrors={null}
        onChange={handleChange}
        onEdit={jest.fn().mockResolvedValue(undefined)}
        onDone={jest.fn().mockResolvedValue(undefined)}
      />,
    );

    const input = screen.getByTestId('mock-textinput-name_4');
    fireEvent.change(input, { target: { value: 'Dana Updated' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
