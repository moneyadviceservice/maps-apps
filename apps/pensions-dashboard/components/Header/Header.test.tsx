import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Header component', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    expect(header).toMatchSnapshot();
  });

  it('does not render the log out option if not a logged in page excluded', () => {
    render(<Header isLoggedInPage={false} />);
    const logoutLink = screen.queryByTestId('log-out-link');
    expect(logoutLink).not.toBeInTheDocument();
  });

  it('renders correctly when the nav is opened with a click', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.click(navToggle);
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by a Space keypress', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by an Enter keypress', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: 'Enter' });
    expect(header).toMatchSnapshot();
  });

  it('fires handleLogout when log out link is clicked', () => {
    const handleLogout = jest.fn();
    render(<Header setIsLogoutModalOpen={handleLogout} />);
    const logoutLink = screen.getByTestId('logout-link');
    fireEvent.click(logoutLink);
    expect(handleLogout).toHaveBeenCalled();
  });

  it('fires handleLogout when log out link is activated by a keypress', () => {
    const handleLogout = jest.fn();
    render(<Header setIsLogoutModalOpen={handleLogout} />);
    const logoutLink = screen.getByTestId('logout-link');
    fireEvent.keyDown(logoutLink, { key: 'Enter' });
    expect(handleLogout).toHaveBeenCalled();
  });

  it('closes the modal when the cancel button is clicked', () => {
    render(<Header isLogoutModalOpen={true} />);
    const cancelButton = screen.getByTestId('logout-no');
    fireEvent.click(cancelButton);
    expect(cancelButton).toBeInTheDocument();
  });
});
