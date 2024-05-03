import { ReactNode, useState, useEffect } from 'react';
import { useTranslation } from '@maps-digital/shared/hooks';
import { Icon, IconType } from '../Icon';
import { Button } from '../../components/Button';

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
    <div data-testid={testId}>
      {!contentIsVisible && jsEnabled && (
        <Button
          className="group gap-0"
          variant="link"
          onClick={() => setContentIsVisible(true)}
          data-testid="show-hide-view-btn"
          type="button"
        >
          <span className={iconClasses}>
            <Icon type={IconType.CHEVRON_DOWN} className={svgClasses} />
          </span>
          {showMoreText ??
            z({
              en: 'View all',
              cy: 'Gweld popeth',
            })}
        </Button>
      )}
      <div className={contentIsVisible ? 'block' : 'hidden'}>{children}</div>
      {contentIsVisible && jsEnabled && (
        <Button
          className="group md:mt-6 xl:mt-10 gap-0"
          variant="link"
          onClick={() => setContentIsVisible(false)}
          data-testid="show-hide-close-btn"
          type="button"
        >
          <span className={iconClasses}>
            <Icon
              type={IconType.CHEVRON_DOWN}
              className={svgClasses + ' rotate-[180deg]'}
            />
          </span>
          {showLessText ??
            z({
              en: 'Close',
              cy: 'Cau',
            })}
        </Button>
      )}
    </div>
  );
};
