import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('Modal component', () => {
  const modalContent = 'This is modal content';
  const onClose = jest.fn();

  const renderModal = ({
    isOpen,
    extra,
  }: {
    isOpen: boolean;
    extra?: React.ReactNode;
  }) =>
    render(
      <>
        {extra}
        <Modal isOpen={isOpen} onClose={onClose}>
          <div data-testid="modal-content">{modalContent}</div>
        </Modal>
      </>,
    );

  beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = renderModal({ isOpen: false });
    expect(container.firstChild).toBeNull();
  });

  it('renders modal using a dialog element when isOpen is true', () => {
    const { container } = renderModal({ isOpen: true });
    expect(container.firstChild).not.toBeNull();
    const dialog = screen.getByRole('dialog');
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('calls the dialog element showModal method after rendering when isOpen is true', async () => {
    renderModal({ isOpen: true });
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose and the dialog element close method when clicking outside the modal', async () => {
    renderModal({
      isOpen: true,
      extra: <div data-testid="outside">Outside</div>,
    });
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose and the dialog element close method when pressing Escape', async () => {
    renderModal({ isOpen: true });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose and the dialog element close method when clicking the close button', async () => {
    renderModal({ isOpen: true });
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
    });
  });

  it('renders an aria-labelledby attribute with the expected content', async () => {
    renderModal({ isOpen: true });
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe('modal-heading');
  });
});
