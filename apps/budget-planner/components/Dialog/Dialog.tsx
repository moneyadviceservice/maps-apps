import { DialogHTMLAttributes, SyntheticEvent, useEffect, useRef } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { linkClasses } from '@maps-react/common/components/Link';

export type DialogProps = DialogHTMLAttributes<HTMLDialogElement> & {
  isOpen: boolean;
  accessibilityLabelClose: string;
  accessibilityLabelReset: string;
  onCloseClick: (event: SyntheticEvent) => void;
  testId?: string;
  children: React.ReactNode;
};

const DialogCloseButton = ({
  accessibilityLabelClose,
  onCloseClick,
}: {
  accessibilityLabelClose: string;
  onCloseClick: (event: SyntheticEvent) => void;
}) => (
  <Button
    variant="close"
    id="closeDialog"
    data-testid="close-dialog"
    type="button"
    aria-label={accessibilityLabelClose}
    onClick={onCloseClick}
    className={twMerge(linkClasses, 'right-4 top-2')}
  >
    <div className="flex items-center justify-end font-semibold text-magenta-500">
      <Icon className="mr-2 w-[14px] h-[14px]" type={IconType.CLOSE} />{' '}
      {accessibilityLabelClose}
    </div>
  </Button>
);

const usePreventAutoClose = () => {
  const preventAutoClose = (e: SyntheticEvent) => e.stopPropagation();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      preventAutoClose(e);
    }
  };
  return { preventAutoClose, handleKeyDown };
};

export const Dialog = ({
  isOpen,
  accessibilityLabelClose,
  accessibilityLabelReset,
  onCloseClick,
  testId,
  children,
  ...rest
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { preventAutoClose, handleKeyDown } = usePreventAutoClose();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      className="p-0 rounded-bl-[32px] text-left backdrop:bg-black/40"
      aria-label={accessibilityLabelReset}
      ref={dialogRef}
      onClose={onCloseClick}
      data-testid={testId ?? 'dialog'}
      {...rest}
    >
      <div className="max-w-[500px]">
        <DialogCloseButton
          accessibilityLabelClose={accessibilityLabelClose}
          onCloseClick={onCloseClick}
        />
        <div
          className="flex flex-col items-start justify-between gap-2 p-6 pt-12"
          onClick={preventAutoClose}
          onKeyDown={handleKeyDown}
        >
          <div className="text-base">{children}</div>
        </div>
      </div>
    </dialog>
  );
};
