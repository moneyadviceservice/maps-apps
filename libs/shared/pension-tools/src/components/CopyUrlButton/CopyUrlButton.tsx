import { useEffect, useRef, useState } from 'react';

import copy from 'copy-to-clipboard';

import { Button, type ButtonProps } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { JsOnly } from '../../components/JsOnly';

export type CopyUrlButtonProps = Pick<ButtonProps, 'variant'> & {
  label: string;
  labelConfirmation?: string;
  labelResetDelay?: number;
  url?: string;
};

/**
 * A button component that copies either a custom URL or the current page URL to the clipboard when clicked.
 * It displays a temporary confirmation label after the URL has been copied, then resets back to the default label after a specified delay.
 * The copy functionality is only available when JavaScript is enabled, so the button will not render if JavaScript is disabled.
 *
 * @param props Props for the CopyUrlButton component
 * @param props.label The default button label
 * @param props.labelConfirmation The label to show temporarily after the URL has been copied
 * @param props.labelResetDelay The delay in milliseconds before resetting the button label to the default (defaults to 3 seconds)
 * @param props.url The URL to copy to the clipboard (defaults to the current window location)
 * @param props.variant The button variant style (defaults to 'primary')
 * @returns A React button component
 */
export const CopyUrlButton = ({
  label,
  labelConfirmation,
  labelResetDelay = 3000,
  url,
  variant = 'primary',
}: CopyUrlButtonProps) => {
  const [buttonLabel, setButtonLabel] = useState(label);
  const timeoutRef = useRef<number | null>(null);

  const { z } = useTranslation();

  const labelConfirmationDefault = z({
    en: 'Link copied',
    cy: `Dolen wedi'i chopïo`,
  });

  // Clear any existing timer
  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Start timer to reset button text after delay
  const startTimer = () => {
    timeoutRef.current = window.setTimeout(() => {
      setButtonLabel(label);
    }, labelResetDelay);
  };

  // Show the confirmation button text temporarily
  const showConfirmationLabel = () => {
    clearTimer();
    setButtonLabel(labelConfirmation ?? labelConfirmationDefault);
    startTimer();
  };

  // Copy the URL to the clipboard and update the button text
  const handleClick = () => {
    copy(url ?? window.location.href);
    showConfirmationLabel();
  };

  // Clear any leftover timer when the component unmounts
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <JsOnly>
      <Button
        variant={variant}
        type="button"
        onClick={handleClick}
        data-testid="copy-url-button"
      >
        {buttonLabel}
      </Button>
    </JsOnly>
  );
};
