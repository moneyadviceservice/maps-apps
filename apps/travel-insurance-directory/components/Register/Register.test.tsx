import { useRouter } from 'next/router';

import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { CreateUserObject } from 'types/register';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormErrorsState, Register } from './Register';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWithContext = (
  initialValues: CreateUserObject | undefined = undefined,
  initialErrors: FormErrorsState | null | undefined = null,
  displayOtp?: boolean,
) => {
  return render(
    <ErrorSummaryProvider initialErrors={initialErrors}>
      {() => <Register initialValues={initialValues} displayOtp={displayOtp} />}
    </ErrorSummaryProvider>,
  );
};

describe('<Register />', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('clicks submit button (JS enabled) and displays OTP on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    renderWithContext();

    const submitButton = screen.getByTestId('signupUser');

    expect(submitButton).toHaveTextContent('Next');

    userEvent.click(submitButton);

    expect(await screen.findByTestId('otp')).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Confirm');
  });

  it('submits form (noJS) and displays OTP input on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    renderWithContext();

    fireEvent.submit(screen.getByTestId('registerForm'));

    expect(await screen.findByTestId('otp')).toBeInTheDocument();
  });

  it('shows OTP input when displayOtp prop is true (non-JS flow)', async () => {
    renderWithContext(undefined, null, true);

    expect(await screen.findByTestId('otp')).toBeInTheDocument();
  });

  it('shows success message after OTP verification succeeds', async () => {
    // First call: initial submit (OTP requested)
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: true }),
      })
      // Second call: OTP submit (success)
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
        }),
      });

    const { getByTestId, findByTestId } = renderWithContext({
      mail: 'test@email.com',
    });

    const submitButton = screen.getByTestId('signupUser');

    const emailInput = getByTestId('mail');

    expect(emailInput).toHaveValue('test@email.com');

    fireEvent.change(emailInput, { target: { value: 'test+123@email.com' } });
    await userEvent.click(submitButton);

    expect(emailInput).toHaveValue('test+123@email.com');
    const emailText = await findByTestId('email-text');

    expect(emailText).toHaveTextContent('test+123@email.com');
    expect(emailInput).toHaveAttribute('readonly');

    const otpInput = await findByTestId('otp');

    fireEvent.change(otpInput, {
      target: { value: '123456' },
    });

    await userEvent.click(submitButton);

    expect(mockPush).toHaveBeenCalledWith('/register/firm/step1');
  });

  it('displays errors when the API returns field errors', async () => {
    // First call: initial submit (email error)
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({
          error: true,
          fields: { mail: { error: 'invalid' } },
        }),
      })
      // Second call: initial submit (OTP requested)
      .mockResolvedValueOnce({
        json: async () => ({ success: true }),
      })
      // Third call: OTP submit (OTP error)
      .mockResolvedValueOnce({
        json: async () => ({
          error: true,
          fields: { otp: { error: 'invalid' } },
        }),
      });
    renderWithContext();
    const submitButton = screen.getByTestId('signupUser');

    await userEvent.click(submitButton);

    expect(await screen.findByTestId('mail-error')).toBeInTheDocument();

    await userEvent.click(submitButton);

    expect(await screen.findByTestId('otp-heading')).toBeInTheDocument();

    await userEvent.click(submitButton);

    expect(await screen.findByTestId('otp-errors')).toHaveTextContent(
      'Please enter the One-Time passcode which has been sent to:',
    );
  });

  it('displays page errors not related to a specific field', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        error: true,
        fields: { page: { error: 'general_error' } },
      }),
    });

    renderWithContext();
    const submitButton = screen.getByTestId('signupUser');

    await userEvent.click(submitButton);

    expect(await screen.findByTestId('page-error')).toBeInTheDocument();
  });
});
