import { fireEvent, render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { LogoutDialog } from './LogoutDialog';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const mockUseTranslation = useTranslation as jest.Mock;

describe('LogoutDialog', () => {
  const defaultProps = {
    isLogoutModalOpen: true,
    setIsLogoutModalOpen: jest.fn(),
  };

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
    jest.clearAllMocks();
  });

  it('renders the logout dialog when open', () => {
    render(<LogoutDialog {...defaultProps} />);

    const exitLink = screen.getByTestId('logout-yes');
    const cancelButton = screen.getByTestId('logout-dialog');

    expect(screen.getByTestId('logout-dialog')).toBeInTheDocument();
    expect(screen.getByText('site.logout.about-to-leave')).toBeInTheDocument();
    expect(
      screen.getByText('site.logout.we-will-redirect'),
    ).toBeInTheDocument();
    expect(screen.getByText('site.logout.are-you-sure')).toBeInTheDocument();
    expect(exitLink).toHaveAttribute(
      'href',
      '/en/you-have-exited-the-pensions-dashboard',
    );
    expect(exitLink).toHaveTextContent('site.logout.yes-exit');
    expect(cancelButton).toHaveTextContent('common.cancel');
  });

  it('renders with custom testId', () => {
    render(<LogoutDialog {...defaultProps} testId="custom-test-id" />);

    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
  });

  it('calls setIsLogoutModalOpen with false when cancel button is clicked', () => {
    const setIsLogoutModalOpen = jest.fn();
    render(
      <LogoutDialog
        {...defaultProps}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />,
    );

    fireEvent.click(screen.getByTestId('logout-no'));
    expect(setIsLogoutModalOpen).toHaveBeenCalledWith(false);
  });

  it('calls setIsLogoutModalOpen with false when dialog close button is clicked', () => {
    const setIsLogoutModalOpen = jest.fn();
    render(
      <LogoutDialog
        {...defaultProps}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />,
    );

    const closeButton = screen.getByLabelText('common.close');
    fireEvent.click(closeButton);
    expect(setIsLogoutModalOpen).toHaveBeenCalledWith(false);
  });
});
