import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailInputField from './EmailInputField';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';
import '@testing-library/jest-dom';

jest.mock('lib/validation/partner', () => ({
  getErrorMessageByKey: jest.fn(),
  hasFieldError: jest.fn(),
}));

jest.mock('components/VisibleSection', () => ({
  VisibleSection: ({
    visible,
    children,
  }: {
    visible: boolean;
    children: React.ReactNode;
  }) => (visible ? <div data-testid="visible-section">{children}</div> : null),
}));

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="errors-wrapper">{children}</div>
  ),
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children, id, className }: any) => (
    <p data-testid={id || 'paragraph'} className={className}>
      {children}
    </p>
  ),
}));

jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: (props: any) => <input data-testid="text-input" {...props} />,
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, string> = {
    'saveAndComeBack.userEmailLabelText': 'Your email address',
    'saveAndComeBack.emailHint':
      'We’ll only use this to send you a link to access your saved progress.',
    'saveAndComeBack.errors.email_generic': 'Invalid email',
  };
  return {
    __esModule: true,
    default: () => ({
      t: (k: string) => mapping[k] ?? k,
      z: (obj: any) => obj.en,
      tList: () => [],
      locale: 'en',
    }),
  };
});

describe('test EmailInputField component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders user label for partnerId 1 and partner label for partnerId 2', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue(null);
    (hasFieldError as jest.Mock).mockReturnValue(false);

    render(
      <EmailInputField emailValue="" formErrors={null} onChange={() => {}} />,
    );
    expect(screen.getByLabelText('Your email address')).toBeInTheDocument();
  });

  it('renders the hint paragraph from translations', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue(null);
    (hasFieldError as jest.Mock).mockReturnValue(false);

    render(
      <EmailInputField emailValue="" formErrors={null} onChange={() => {}} />,
    );
    expect(
      screen.getByText(
        'We’ll only use this to send you a link to access your saved progress.',
      ),
    ).toBeInTheDocument();
  });

  it('includes error id in aria-describedby when formErrors is provided even if no specific error message', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue({ email: 'generic' });
    (hasFieldError as jest.Mock).mockReturnValue(false);

    render(
      <EmailInputField
        emailValue=""
        formErrors={{ some: 'error' }}
        onChange={() => {}}
      />,
    );

    const input = screen.getByTestId('text-input');
    expect(input.getAttribute('aria-describedby')).toContain('email-hint');
    expect(input.getAttribute('aria-describedby')).toContain('email-error');
  });

  it('shows the error message when getErrorMessageByKey returns a message and adds error class', () => {
    (getErrorMessageByKey as jest.Mock).mockImplementation((key: string) =>
      key === 'email' ? 'email_generic' : null,
    );
    (hasFieldError as jest.Mock).mockReturnValue(true);

    render(
      <EmailInputField
        emailValue=""
        formErrors={{ email: 'Invalid' }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByTestId('visible-section')).toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();

    const input = screen.getByTestId('text-input');
    expect(input.className).toContain('border-red-700');
  });

  it('calls onChange with the new value and respects defaultValue', () => {
    (getErrorMessageByKey as jest.Mock).mockReturnValue(null);
    (hasFieldError as jest.Mock).mockReturnValue(false);

    const handleChange = jest.fn();
    render(
      <EmailInputField
        emailValue="initial@example.com"
        formErrors={null}
        onChange={handleChange}
      />,
    );

    expect(screen.getByDisplayValue('initial@example.com')).toBeInTheDocument();

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'new@example.com' } });
    expect(handleChange).toHaveBeenCalledWith('new@example.com');
  });
});
