import { fireEvent, render, screen } from '@testing-library/react';

import { Dialog, DialogProps } from './Dialog';

import '@testing-library/jest-dom';

jest.mock('focus-trap-react', () => {
  return ({
    children,
    focusTrapOptions,
  }: {
    children: React.ReactNode;
    focusTrapOptions?: { checkCanFocusTrap?: () => Promise<void> };
  }) => {
    void focusTrapOptions?.checkCanFocusTrap?.();
    return children;
  };
});

const renderDialog = (overrides: Partial<DialogProps> = {}) => {
  const onCloseClick = jest.fn();

  render(
    <Dialog
      isOpen
      accessibilityLabelClose="Close"
      accessibilityLabelReset="Reset"
      onCloseClick={onCloseClick}
      {...overrides}
    >
      <p>Guidance</p>
    </Dialog>,
  );

  return { onCloseClick };
};

describe('Dialog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('shows the dialog and waits until the close control can take focus', () => {
    renderDialog();

    expect(screen.getByTestId('dialog')).toHaveAttribute('aria-label', 'Reset');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Close', hidden: true }),
    ).toHaveAttribute('id', 'closeDialog');
  });

  it('tells the caller when the close control is used', () => {
    const { onCloseClick } = renderDialog();

    fireEvent.click(
      screen.getByRole('button', { name: 'Close', hidden: true }),
    );

    expect(onCloseClick).toHaveBeenCalled();
  });

  it('does not treat a click on the content as closing', () => {
    const { onCloseClick } = renderDialog();

    fireEvent.click(screen.getByText('Guidance'));

    expect(onCloseClick).not.toHaveBeenCalled();
  });

  it('closes the dialog when it is shut', () => {
    renderDialog({ isOpen: false });

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('uses the supplied test id', () => {
    renderDialog({ testId: 'reset-dialog' });

    expect(screen.getByTestId('reset-dialog')).toBeInTheDocument();
  });
});
