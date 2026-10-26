import { fireEvent, render, screen } from '@testing-library/react';

import { LogoutLinkText } from './LogoutLinkText';

import '@testing-library/jest-dom';

// Mock the useTranslation hook
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
  }),
}));

// Mock the useLogoutHandler hook
const mockSetIsLogoutModalOpen = jest.fn();
const mockHandleLogout = jest.fn();
let mockIsLogoutModalOpen = false;

jest.mock('./useLogoutHandler', () => ({
  useLogoutHandler: () => ({
    isLogoutModalOpen: mockIsLogoutModalOpen,
    setIsLogoutModalOpen: mockSetIsLogoutModalOpen,
    handleLogout: mockHandleLogout,
  }),
}));

// Mock LogoutDialog component
jest.mock('./LogoutDialog', () => ({
  LogoutDialog: ({ testId }: { testId: string }) => (
    <div data-testid={testId}>Mocked Logout Dialog</div>
  ),
}));

describe('LogoutLinkText', () => {
  const defaultProps = {
    text: 'Sign out of your account',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLogoutModalOpen = false;
  });

  it('renders with the provided text', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Sign out of your account');
  });

  it('applies default testId when not provided', () => {
    render(<LogoutLinkText {...defaultProps} />);

    expect(screen.getByTestId('logout-link')).toBeInTheDocument();
  });

  it('applies custom testId when provided', () => {
    render(<LogoutLinkText {...defaultProps} testId="custom-logout-text" />);

    const link = screen.getByTestId('custom-logout-text');
    expect(link).toBeInTheDocument();
    expect(screen.queryByTestId('logout-link')).not.toBeInTheDocument();
  });

  it('applies default className when not provided', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    expect(link).toHaveClass('md:inline');
  });

  it('applies custom className when provided', () => {
    render(<LogoutLinkText {...defaultProps} className="custom-class" />);

    const link = screen.getByTestId('logout-link');
    expect(link).toHaveClass('custom-class');
    expect(link).not.toHaveClass('md:inline');
  });

  it('has correct href pointing to you-are-about-to-leave page', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    expect(link).toHaveAttribute('href', '/en/you-are-about-to-leave');
  });

  it('calls handleLogout when clicked', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    fireEvent.click(link);

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    expect(mockHandleLogout).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls handleLogout when Enter key is pressed', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    fireEvent.keyDown(link, { key: 'Enter' });

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    expect(mockHandleLogout).toHaveBeenCalledWith(expect.any(Object));
  });

  it('wraps content in FocusTrap with correct structure', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    expect(link.closest('span')).toBeInTheDocument();
  });

  it('does not show dialog when isLogoutModalOpen is false', () => {
    render(<LogoutLinkText {...defaultProps} />);

    expect(screen.queryByTestId('logout-link-dialog')).not.toBeInTheDocument();
  });

  it('shows dialog when isLogoutModalOpen is true', () => {
    mockIsLogoutModalOpen = true;

    render(<LogoutLinkText {...defaultProps} />);

    expect(screen.getByTestId('logout-link-dialog')).toBeInTheDocument();
  });

  it('passes correct testId to LogoutDialog', () => {
    mockIsLogoutModalOpen = true;

    render(<LogoutLinkText {...defaultProps} testId="custom-test" />);

    expect(screen.getByTestId('custom-test-dialog')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<LogoutLinkText {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href');
  });
});
