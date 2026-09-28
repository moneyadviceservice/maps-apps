import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/index';

interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    if (modalRef.current !== null) {
      modalRef.current.close();
    }
    setDialogOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      if (modalRef.current !== null) {
        modalRef.current.showModal();
        setDialogOpen(true);
      }

      document.addEventListener('mousedown', handleClickOutside);
    } else {
      setDialogOpen(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <dialog
        ref={modalRef}
        open={dialogOpen}
        aria-modal="true"
        aria-labelledby="modal-heading"
        className="bg-white rounded-xl shadow-xl w-full max-w-[820px] p-10 relative"
      >
        <div ref={modalContentRef}>
          <div className="flex justify-end items-center">
            <Button
              type="button"
              variant="link"
              onClick={closeModal}
              className="flex flex-col text-inherit no-underline"
            >
              <Icon type={IconType.CLOSE} className="w-6" />
              <span className="text-sm -mt-">
                close <span className="sr-only">modal</span>
              </span>
            </Button>
          </div>
          <div>{children}</div>
        </div>
      </dialog>
    </div>
  );
};
