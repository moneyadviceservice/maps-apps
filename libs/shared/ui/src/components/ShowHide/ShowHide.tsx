import { ReactNode, useState, useEffect } from 'react';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Icon, IconType } from '../Icon';
import { Button } from '../../components/Button';
import { twMerge } from 'tailwind-merge';

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

  const iconClasses =
    'flex items-center content-center rounded mr-4 w-[40px] h-[40px] shadow-bottom-gray border border-pink-600 bg-white group-hover:border-pink-800 group-focus:bg-yellow-200 group-focus:shadow-none';
  const svgClasses =
    'w-12 h-6 text-pink-600 group-hover:text-pink-800 group-focus:text-gray-800';

  return (
    <div className="flex flex-col-reverse" data-testid={testId}>
      {jsEnabled && (
        <Button
          className={`group gap-0 ${
            contentIsVisible ? 'md:mt-6 xl:mt-10' : ''
          }`}
          variant="link"
          onClick={() => setContentIsVisible(!contentIsVisible)}
          data-testid={
            contentIsVisible ? 'show-hide-close-btn' : 'show-hide-view-btn'
          }
          type="button"
          aria-controls="expanded-content"
          aria-expanded={contentIsVisible}
        >
          <span className={iconClasses}>
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
        </Button>
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
