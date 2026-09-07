import { DialogHTMLAttributes, SyntheticEvent, useEffect, useRef } from 'react';

import FocusTrap from 'focus-trap-react';
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
  const preventAutoClose = (e: SyntheticEvent) => e.stopPropagation();

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
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          allowOutsideClick: true,
          initialFocus: '#closeDialog',
          returnFocusOnDeactivate: true,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          checkCanFocusTrap: () => {
            return new Promise<void>((resolve) => {
              // Wait briefly for DOM to render, then resolve
              setTimeout(() => resolve(), 10);
            });
          },
        }}
      >
        <div className="max-w-[500px]">
          <Button
            variant="close"
            id="closeDialog"
            data-testid="close-dialog"
            type="button"
            aria-label={accessibilityLabelClose}
            onClick={onCloseClick}
            className={twMerge(linkClasses, 'right-2 top-2 px-4 py-2')}
          >
            <div className="flex items-center justify-end font-semibold text-magenta-500">
              <Icon className="mr-2 w-[14px] h-[14px]" type={IconType.CLOSE} />{' '}
              {accessibilityLabelClose}
            </div>
          </Button>
          <div
            className={
              'flex flex-col p-8 pt-12 gap-2 justify-between items-start'
            }
            onClick={preventAutoClose}
          >
            <div className="text-base">{children}</div>
          </div>
        </div>
      </FocusTrap>
    </dialog>
  );
};
