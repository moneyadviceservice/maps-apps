import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import { Heading, Level } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';

type Props = {
  title: string;
  children?: React.ReactNode;
  errors?: Record<string, (string | undefined)[]> | null;
  classNames?: string;
  containerClassNames?: string;
  errorKeyPrefix?: string;
  handleErrorClick?: () => void;
  titleLevel?: Level;
};

export type Ref = {
  focus: () => void;
  scrollIntoView: () => void;
} | null;

export const scrollElementIntoView = (
  element: HTMLElement | null | undefined,
) => {
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
};

export const ErrorSummary = forwardRef<Ref, Props>(
  (
    {
      title,
      children,
      errors,
      classNames,
      errorKeyPrefix = '',
      titleLevel = 'h2',
      handleErrorClick,
      containerClassNames,
    }: Props,
    ref,
  ) => {
    const errorRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(
      ref,
      () => {
        return {
          focus() {
            errorRef?.current?.focus();
          },
          scrollIntoView() {
            scrollElementIntoView(errorRef?.current);
          },
        };
      },
      [],
    );
    const [jsEnabled, setJsEnabled] = useState(false);

    const handleScroll = (key: string) => {
      const target = document.getElementById(key);
      const parent = target?.parentElement?.parentElement;

      const y = target?.getBoundingClientRect().top;
      const parentY = parent?.getBoundingClientRect().top;

      if (y && parentY) {
        window.scroll(0, y - (y - parentY));
        target.focus();
      }
    };

    useEffect(() => {
      setJsEnabled(true);
    }, []);

    const errorsWithMessage = getErrorKeysWithMessages(errors);

    // If no errors, or no errors with messages, do not render the component
    if (!errors || !errorsWithMessage.length) {
      return null;
    }

    const errorItems = errorsWithMessage.map((key, index) => {
      return (
        <Link
          key={key}
          className="whitespace-pre-wrap"
          href={`#${errorKeyPrefix}${key}`}
          scroll={false}
          onClick={(e) => {
            if (jsEnabled) {
              e.preventDefault();
              handleScroll(`${errorKeyPrefix}${key}`);
              handleErrorClick?.();
            }
          }}
          data-testid={`error-link-${index}`}
        >
          {errors[key]}
        </Link>
      );
    });

    return (
      <div
        ref={errorRef}
        role="alert"
        aria-relevant="all"
        aria-describedby="error-summary-heading"
        id="error-summary-container"
        data-testid="error-summary-container"
        tabIndex={-1}
        className={containerClassNames}
      >
        <div
          className={twMerge(
            't-error-summary border-4 w-full border-red-600 md:p-8 p-6 outline-none',
            classNames,
          )}
          data-testid="error-records"
        >
          <Heading
            id="error-summary-heading"
            level="h4"
            component={titleLevel}
            className="mb-3"
            data-testid="error-summary-heading"
          >
            {title}
          </Heading>
          {children}
          <ListElement
            variant="error"
            color="red"
            items={errorItems}
            className={twMerge(
              errorItems.length < 2 ? '' : 'pl-6 ml-4',
              'mb-6',
            )}
          />
        </div>
      </div>
    );
  },
);

ErrorSummary.displayName = 'ErrorSummary';

/**
 * Returns an array of error keys that have at least one non-empty string message.
 * @param errors - Record of error arrays
 */
export function getErrorKeysWithMessages(
  errors?: Record<string, (string | undefined)[]> | null,
): string[] {
  if (!errors) return [];
  return Object.keys(errors).filter(
    (key) =>
      Array.isArray(errors[key]) &&
      errors[key].some(
        (msg) => typeof msg === 'string' && msg.trim().length > 0,
      ),
  );
}
