import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('Modal component', () => {
  const modalContent = 'This is modal content';
  const onClose = jest.fn();

  const renderModal = (isOpen: boolean, extra?: React.ReactNode) =>
    render(
      <>
        {extra}
        <Modal isOpen={isOpen} onClose={onClose}>
          <div data-testid="modal-content">{modalContent}</div>
        </Modal>
      </>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = renderModal(false);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when clicking outside the modal', () => {
    renderModal(true, <div data-testid="outside">Outside</div>);
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape', () => {
    renderModal(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the close button', async () => {
    renderModal(true);
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
