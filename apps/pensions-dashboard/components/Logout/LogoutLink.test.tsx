import { fireEvent, render, screen } from '@testing-library/react';

import { LogoutLink } from './LogoutLink';

import '@testing-library/jest-dom';

describe('LogoutLink', () => {
  const mockOnClick = jest.fn();
  const mockOnKeyDown = jest.fn();
  const defaultProps = {
    children: 'Sign out',
    href: '/logout',
    onClick: mockOnClick,
    onKeyDown: mockOnKeyDown,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children and href', () => {
    render(<LogoutLink {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/logout');
    expect(link).toHaveTextContent('Sign out');
  });

  it('applies default testId when not provided', () => {
    render(<LogoutLink {...defaultProps} />);

    expect(screen.getByTestId('logout-link')).toBeInTheDocument();
  });

  it('applies custom testId and className when provided', () => {
    render(
      <LogoutLink
        {...defaultProps}
        testId="custom-logout"
        className="custom-class"
      />,
    );
    const link = screen.getByTestId('custom-logout');
    expect(link).toBeInTheDocument();
    expect(screen.queryByTestId('logout-link')).not.toBeInTheDocument();
    expect(link).toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    render(<LogoutLink {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    fireEvent.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls onKeyDown handler when key is pressed', () => {
    render(<LogoutLink {...defaultProps} />);

    const link = screen.getByTestId('logout-link');
    fireEvent.keyDown(link, { key: 'Enter' });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    expect(mockOnKeyDown).toHaveBeenCalledWith(expect.any(Object));
  });
});
