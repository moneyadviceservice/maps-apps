import {
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
import { Paragraph } from '@maps-react/common/components/Paragraph';

type Props = {
  title: string;
  description?: string | string[];
  errors: Record<string, string[]>;
  classNames?: string;
  errorKeyPrefix?: string;
  handleErrorClick?: () => void;
  titleLevel?: Level;
};
export type Ref = {
  focus: () => void;
  scrollIntoView: () => void;
} | null;

const scrollElementIntoView = (element: HTMLElement | null | undefined) => {
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
      description,
      errors,
      classNames,
      errorKeyPrefix = '',
      titleLevel,
      handleErrorClick,
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

    const errorItems = Object.keys(errors).map((key, index) => {
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

    const descriptionParagraphs = Array.isArray(description)
      ? description
      : [description];
    return (
      <div
        ref={errorRef}
        role="alert"
        aria-relevant="all"
        aria-describedby={
          Object.values(errors).some((arr) => arr.length > 0)
            ? 'error-summary-heading'
            : undefined
        }
        id="error-summary-container"
        data-testid="error-summary-container"
        tabIndex={-1}
      >
        {Object.values(errors).some((arr) => arr.length > 0) && (
          <div
            className={twMerge(
              't-error-summary border-4 w-full border-red-600 py-8 px-4 sm:px-6 lg:px-8 outline-none',
              classNames,
            )}
            data-testid="error-records"
          >
            <Heading
              id="error-summary-heading"
              level="h4"
              component={titleLevel ?? 'h5'}
            >
              {title}
            </Heading>
            {descriptionParagraphs && descriptionParagraphs.length > 0 && (
              <div className="text-base pt-4">
                {descriptionParagraphs.map((_, i) => {
                  return (
                    <Paragraph key={'description' + i}>
                      {descriptionParagraphs[i]}
                    </Paragraph>
                  );
                })}
              </div>
            )}
            <div className={Object.keys(errors).length === 1 ? '' : 'pl-6'}>
              <ListElement variant="error" color="red" items={errorItems} />
            </div>
          </div>
        )}
      </div>
    );
  },
);

ErrorSummary.displayName = 'ErrorSummary';
