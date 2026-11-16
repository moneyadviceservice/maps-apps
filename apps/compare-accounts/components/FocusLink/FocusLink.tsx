import { MouseEvent, ReactNode, useEffect } from 'react';

import { Button, ButtonProps } from '@maps-react/common/components/Button';

export type Props = ButtonProps & {
  focusID: string;
  action: Action;
  children: ReactNode;
};

export enum Action {
  TopOfPage,
}

export const unfocusElement = (element: HTMLElement): void => {
  if (element.hasAttribute('tabIndex')) element.removeAttribute('tabIndex');
};

const FocusLink = ({
  focusID,
  action,
  className,
  iconRight,
  children,
}: Props) => {
  let focusElement: HTMLElement | null = null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // Should handle getting the location of element with focusID
    if (action === Action.TopOfPage) {
      window.scrollTo(0, 0);
    }

    if (focusElement) focusElement.focus();
  };

  const getElementRef = (id: string): HTMLElement | null => {
    return document.getElementById(id);
  };

  const handleBlur = (event: Event) => {
    event.preventDefault();
    if (focusElement) {
      unfocusElement(focusElement);
    }
  };

  useEffect(() => {
    focusElement = getElementRef(focusID);
    if (focusElement) {
      focusElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (focusElement) {
        focusElement.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <Button
      className={className}
      variant="link"
      href={`#${focusID}`}
      as={'a'}
      iconRight={iconRight}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default FocusLink;
