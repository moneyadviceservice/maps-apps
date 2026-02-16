import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Register } from './Register';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/index', () => ({
  Button: ({
    children,
    ...props
  }: React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >) => <button {...props}>{children}</button>,
}));

type MockTextInputProps = {
  name?: string;
  'data-testid'?: string;
};

jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: ({ name, 'data-testid': testId }: MockTextInputProps) => (
    <input data-testid={testId} name={name} />
  ),
}));

describe('<Register />', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows OTP input after initial submit', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    });

    render(<Register />);

    // Submit form without OTP
    fireEvent.submit(screen.getByTestId('registerForm'));

    // OTP field should appear
    expect(await screen.findByTestId('otp')).toBeInTheDocument();
  });

  it('shows success message after OTP verification succeeds', async () => {
    // First call: initial submit (OTP requested)
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({}),
      })
      // Second call: OTP submit (success)
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
        }),
      });

    render(<Register />);

    // Initial submit
    fireEvent.submit(screen.getByTestId('registerForm'));

    // OTP appears
    const otpInput = await screen.findByTestId('otp');

    // Fill OTP
    fireEvent.change(otpInput, {
      target: { value: '123456' },
    });

    // Submit again
    fireEvent.submit(screen.getByTestId('registerForm'));

    // Success UI
    await waitFor(() => {
      expect(screen.getByText('Registration Successful')).toBeInTheDocument();
    });
  });
});
