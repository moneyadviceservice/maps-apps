import { H5 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import Link from 'next/link';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  title: string;
  errors: Record<string, string[]>;
  classNames?: string;
  errorKeyPrefix?: string;
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
  ({ title, errors, classNames, errorKeyPrefix = '' }: Props, ref) => {
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

    return (
      <div
        ref={errorRef}
        role="alert"
        aria-relevant="all"
        aria-describedby="error-summary-heading"
        id="error-summary-container"
        data-testid="error-summary-container"
        tabIndex={-1}
      >
        {Object.keys(errors).length > 0 && (
          <div
            className={twMerge(
              't-error-summary border-4 w-full border-red-700 py-8 px-4 sm:px-6 lg:px-8 outline-none',
              classNames,
            )}
            data-testid="error-records"
          >
            <div className="flex items-center">
              <Icon
                data-testid="icon-error"
                className="min-w-[50px] fill-red-700"
                type={IconType.WARNING}
              ></Icon>
              <H5 id="error-summary-heading">{title}</H5>
            </div>
            <div className="pl-4 md:pl-[50px]">
              <ul className="list-disc mt-3 ml-4">
                {Object.keys(errors).map((key, index) => {
                  return (
                    errors[key].length > 0 && (
                      <li
                        key={key}
                        className={twMerge(
                          Object.keys(errors).length < 2 && 'list-none -ml-4',
                          'underline text-lg decoration-solid text-red-700 mb-2.5 last:mb-0 break-words',
                        )}
                      >
                        <Link
                          className="whitespace-pre-wrap"
                          href={`#${errorKeyPrefix}${key}`}
                          scroll={false}
                          onClick={(e) => {
                            if (jsEnabled) {
                              e.preventDefault();
                              handleScroll(`${errorKeyPrefix}${key}`);
                            }
                          }}
                          data-testid={`error-link-${index}`}
                        >
                          {errors[key]}
                        </Link>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  },
);

ErrorSummary.displayName = 'ErrorSummary';
