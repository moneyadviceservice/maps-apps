import { ReactNode, useEffect, useRef } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/index';

interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-[820px] p-10 relative"
      >
        <div className="flex justify-end items-center">
          <Button
            variant="link"
            onClick={onClose}
            className="flex flex-col text-inherit no-underline"
          >
            <Icon type={IconType.CLOSE} className="w-6" />
            <span className="text-sm -mt-">close</span>
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
