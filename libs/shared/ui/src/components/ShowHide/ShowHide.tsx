import { ReactNode, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Icon, IconType } from '../Icon';

export type ShowHideProps = {
  children: ReactNode;
  testId?: string;
  showMoreText?: string;
  showLessText?: string;
};

// progressively enhanced show and hide
export const ShowHide = ({
  children,
  testId = 'show-hide',
  showMoreText,
  showLessText,
}: ShowHideProps) => {
  // default is js disabled and content visible
  const [contentIsVisible, setContentIsVisible] = useState(true);
  const [jsEnabled, setJSEnabled] = useState(false);
  const { z } = useTranslation();

  // if js is enabled it will hide the content, and enable the toggle buttons
  useEffect(() => {
    setContentIsVisible(false);
    setJSEnabled(true);
  }, []);

  const buttonClasses = [
    'group',
    'inline-flex',
    'items-center',
    'self-start',
    'align-middle',
    'text-magenta-500',
    'underline',
    'font-semibold',
    'focus-visible:outline-none',
  ];

  const iconClasses = [
    'flex',
    'items-center',
    'content-center',
    'rounded',
    'mr-4',
    'w-[40px]',
    'h-[40px]',
    'shadow-bottom-gray',
    'border',
    'border-magenta-500',
    'bg-white',

    'group-hover:border-pink-800',

    'group-focus:bg-yellow-400',
    'group-focus:border-blue-700',
    'group-focus:border-[3px]',

    'group-focus-visible:bg-yellow-400',
    'group-focus-visible:border-blue-700',
    'group-focus-visible:border-[3px]',

    'group-active:bg-white',
    'group-active:border-blue-700',
    'group-active:border-[3px]',
    'group-active:shadow-top-gray',
  ];

  const svgClasses = [
    'w-12',
    'h-6',
    'text-magenta-500',

    'group-hover:text-pink-800',

    'group-focus:text-gray-800',
    'group-focus-visible:text-gray-800',

    'group-active:text-gray-800',
  ];

  return (
    <div className="flex flex-col-reverse" data-testid={testId}>
      {jsEnabled && (
        <button
          className={twMerge(
            buttonClasses,
            contentIsVisible && 'md:mt-6 xl:mt-10',
          )}
          onClick={() => setContentIsVisible(!contentIsVisible)}
          data-testid={
            contentIsVisible ? 'show-hide-close-btn' : 'show-hide-view-btn'
          }
          type="button"
          aria-controls="expanded-content"
          aria-expanded={contentIsVisible}
        >
          <span className={twMerge(iconClasses)}>
            <Icon
              type={IconType.CHEVRON_DOWN}
              className={twMerge(
                svgClasses,
                contentIsVisible ? ' rotate-[180deg]' : '',
              )}
            />
          </span>{' '}
          {contentIsVisible
            ? showMoreText ??
              z({
                en: 'Close',
                cy: 'Cau',
              })
            : showLessText ??
              z({
                en: 'View all',
                cy: 'Gweld popeth',
              })}
        </button>
      )}
      <div
        id="expanded-content"
        data-testid="expanded-content"
        className={contentIsVisible ? 'block' : 'hidden'}
      >
        {children}
      </div>
    </div>
  );
};
