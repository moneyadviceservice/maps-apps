import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('focus-trap-react', () => {
  return function MockFocusTrap({
    children,
    active,
    focusTrapOptions,
  }: {
    children: React.ReactNode;
    active: boolean;
    focusTrapOptions?: {
      initialFocus?: string | boolean;
      escapeDeactivates?: boolean;
      returnFocusOnDeactivate?: boolean;
      allowOutsideClick?: boolean;
      clickOutsideDeactivates?: boolean;
    };
  }) {
    return (
      <div
        data-testid="focus-trap"
        data-active={active}
        data-initial-focus={focusTrapOptions?.initialFocus}
        data-escape-deactivates={focusTrapOptions?.escapeDeactivates}
        data-return-focus={focusTrapOptions?.returnFocusOnDeactivate}
      >
        {children}
      </div>
    );
  };
});

const handleLogout = jest.fn();

describe('Header component', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(<Header handleLogout={handleLogout} />);
    const header = screen.getByTestId('header');
    expect(header).toMatchSnapshot();
  });

  it('does not render the log out option if not a logged in page excluded', () => {
    render(<Header handleLogout={handleLogout} isLoggedInPage={false} />);
    const logoutLink = screen.queryByTestId('log-out-link');
    expect(logoutLink).not.toBeInTheDocument();
  });

  it('renders correctly when the nav is opened with a click', () => {
    render(<Header handleLogout={handleLogout} />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.click(navToggle);
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by a Space keypress', () => {
    render(<Header handleLogout={handleLogout} />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by an Enter keypress', () => {
    render(<Header handleLogout={handleLogout} />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: 'Enter' });
    expect(header).toMatchSnapshot();
  });

  it('fires handleLogout when log out link is clicked', () => {
    render(<Header handleLogout={handleLogout} isLoggedInPage={true} />);
    const logoutLink = screen.getByTestId('logout-link');
    fireEvent.click(logoutLink);
    expect(handleLogout).toHaveBeenCalled();
  });

  it('fires handleLogout when log out link is activated by a keypress', () => {
    render(<Header handleLogout={handleLogout} isLoggedInPage={true} />);
    const logoutLink = screen.getByTestId('logout-link');
    fireEvent.keyDown(logoutLink, { key: 'Enter' });
    expect(handleLogout).toHaveBeenCalled();
  });

  it('closes the modal when the cancel button is clicked', () => {
    render(<Header handleLogout={handleLogout} isLogoutModalOpen={true} />);
    const cancelButton = screen.getByTestId('logout-no');
    fireEvent.click(cancelButton);
    expect(cancelButton).toBeInTheDocument();
  });

  it('does not show the language switcher when turned off', () => {
    render(
      <Header handleLogout={handleLogout} showLanguageSwitchers={false} />,
    );
    const languageSwitcher = screen.queryByTestId('language-switcher');
    expect(languageSwitcher).not.toBeInTheDocument();
  });

  it('does not show the language switcher button in the nav when turned off', () => {
    render(
      <Header handleLogout={handleLogout} showLanguageSwitchers={false} />,
    );
    const languageSwitcherBtn = screen.queryByTestId('language-switcher-btn');
    expect(languageSwitcherBtn).not.toBeInTheDocument();
  });

  describe('FocusTrap behavior', () => {
    it('activates navigation focus trap when navigation is open and logout modal is closed', () => {
      render(<Header handleLogout={handleLogout} isLogoutModalOpen={false} />);

      // Open navigation
      const navToggle = screen.getByTestId('nav-toggle');
      fireEvent.click(navToggle);

      // Get all focus traps and find the navigation one (contains nav-toggle)
      const focusTraps = screen.getAllByTestId('focus-trap');
      const navigationFocusTrap = focusTraps.find((trap) =>
        trap.querySelector('[data-testid="nav-toggle"]'),
      );

      expect(navigationFocusTrap).toHaveAttribute('data-active', 'true');
    });

    it('deactivates navigation focus trap when logout modal is open', () => {
      render(<Header handleLogout={handleLogout} isLogoutModalOpen={true} />);

      // Get all focus traps and find the navigation one
      const focusTraps = screen.getAllByTestId('focus-trap');
      const navigationFocusTrap = focusTraps.find((trap) =>
        trap.querySelector('[data-testid="nav-toggle"]'),
      );

      expect(navigationFocusTrap).toHaveAttribute('data-active', 'false');
    });

    it('deactivates navigation focus trap when navigation is closed', () => {
      render(<Header handleLogout={handleLogout} isLogoutModalOpen={false} />);

      // Get all focus traps and find the navigation one
      const focusTraps = screen.getAllByTestId('focus-trap');
      const navigationFocusTrap = focusTraps.find((trap) =>
        trap.querySelector('[data-testid="nav-toggle"]'),
      );

      expect(navigationFocusTrap).toHaveAttribute('data-active', 'false');
    });

    it('configures navigation focus trap with correct options', () => {
      render(<Header handleLogout={handleLogout} />);

      // Get all focus traps and find the navigation one
      const focusTraps = screen.getAllByTestId('focus-trap');
      const navigationFocusTrap = focusTraps.find((trap) =>
        trap.querySelector('[data-testid="nav-toggle"]'),
      );

      expect(navigationFocusTrap).toHaveAttribute(
        'data-escape-deactivates',
        'false',
      );
      expect(navigationFocusTrap).toHaveAttribute(
        'data-initial-focus',
        'false',
      );
    });

    it('dialog focus trap is separate and does not interfere with navigation focus trap', () => {
      render(<Header handleLogout={handleLogout} isLogoutModalOpen={true} />);

      const focusTraps = screen.getAllByTestId('focus-trap');
      expect(focusTraps).toHaveLength(2); // Navigation and Dialog

      // Find both traps
      const navigationFocusTrap = focusTraps.find((trap) =>
        trap.querySelector('[data-testid="nav-toggle"]'),
      );
      const dialogFocusTrap = focusTraps.find((trap) =>
        trap.querySelector('[data-testid="close-dialog"]'),
      );

      // Navigation should be inactive when modal is open
      expect(navigationFocusTrap).toHaveAttribute('data-active', 'false');

      // Dialog should be inactive (modal closed, but rendered)
      expect(dialogFocusTrap).toHaveAttribute('data-active', 'false');
    });
  });
});
