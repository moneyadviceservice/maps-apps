import { fireEvent, render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Dialog, DialogProps } from './Dialog';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
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
      initialFocus?: string;
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

describe('TimeoutModal', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: DialogProps = {
    isOpen: true,
    accessibilityLabelClose: 'Close',
    accessibilityLabelReset: 'Reset',
    onCloseClick: jest.fn(),
    children: <div>Content</div>,
  };

  it('should render the modal when isOpen is true', () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<Dialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onCloseClick when close button is clicked', () => {
    render(<Dialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId('close-dialog'));
    expect(defaultProps.onCloseClick).toHaveBeenCalled();
  });

  it('should render with focus trap when modal is open', () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByTestId('focus-trap')).toBeInTheDocument();
  });

  it('should render the close button with correct accessibility attributes', () => {
    render(<Dialog {...defaultProps} />);
    const closeButton = screen.getByTestId('close-dialog');
    expect(closeButton).toHaveAttribute('aria-label', 'Close');
    expect(closeButton).toHaveAttribute('id', 'closeDialog');
  });

  it('should configure focus trap with correct options for accessibility', () => {
    render(<Dialog {...defaultProps} />);
    const focusTrap = screen.getByTestId('focus-trap');

    // Verify focus trap is active when modal is open
    expect(focusTrap).toHaveAttribute('data-active', 'true');

    // Verify initial focus is set to close button
    expect(focusTrap).toHaveAttribute('data-initial-focus', '#closeDialog');

    // Verify escape key deactivates the trap
    expect(focusTrap).toHaveAttribute('data-escape-deactivates', 'true');

    // Verify focus returns on deactivate
    expect(focusTrap).toHaveAttribute('data-return-focus', 'true');
  });

  it('should not activate focus trap when modal is closed', () => {
    render(<Dialog {...defaultProps} isOpen={false} />);
    const focusTrap = screen.queryByTestId('focus-trap');
    expect(focusTrap).toHaveAttribute('data-active', 'false');
  });
});
