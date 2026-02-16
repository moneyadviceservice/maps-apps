import { useRouter } from 'next/router';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FcaLookup } from './FcaLookup';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({
    children,
    disabled,
    type,
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type={type} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: ({
    label,
    error,
    defaultValue,
    name,
    disabled,
    id,
  }: {
    label?: string;
    error?: string;
    defaultValue?: string;
    name?: string;
    disabled?: boolean;
    id?: string;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={!!error}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

describe('FcaLookup Component', () => {
  const mockPush = jest.fn();
  const mockFetch = jest.fn();

  beforeAll(() => {
    globalThis.fetch = mockFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the form with initial values', () => {
    render(<FcaLookup initialFcaNumber="123456" />);

    const input = screen.getByLabelText(
      /FCA Firm Reference Number/i,
    ) as unknown as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Continue/i });

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('123456');
    expect(button).toBeInTheDocument();
  });

  it('redirects to step-2 on valid API response (when data.Data is empty/undefined)', async () => {
    render(<FcaLookup />);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const input = screen.getByLabelText(/FCA Firm Reference Number/i);
    const button = screen.getByRole('button', { name: /Continue/i });

    fireEvent.change(input, { target: { value: '999999' } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(input).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/register/step-2');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/fca-lookup?fcaNumber=999999',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }),
    );
  });

  it('displays "No records found" error if API returns data.Data (per current code logic)', async () => {
    render(<FcaLookup />);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Data: { some: 'record' } }),
    });

    const button = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(button);

    await waitFor(() => {
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('No records found');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays API error message when response is not ok', async () => {
    render(<FcaLookup />);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid FCA Number' }),
    });

    const button = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid FCA Number');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles network exceptions gracefully', async () => {
    render(<FcaLookup />);

    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const button = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network failure');
    });

    expect(button).not.toBeDisabled();
  });
});
