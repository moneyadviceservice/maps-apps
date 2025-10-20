'use client';

import { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '../../components/Icon';

type ChangeEvent =
  | MouseEventHandler<HTMLElement>
  | KeyboardEventHandler<HTMLElement>;

export type ExpandableSectionProps = {
  title: ReactNode;
  closedTitle?: ReactNode;
  children: ReactNode;
  open?: boolean;
  className?: string;
  testClassName?: string;
  testId?: string;
  contentTestClassName?: string;
  variant?: 'hyperlink' | 'main' | 'linkWithoutIcon' | 'mainLeftIcon';
  // Allows first level nesting for accordions
  type?: 'nested';
  onClick?: ChangeEvent;
  contentId?: string;
};

export const ExpandableSection = ({
  title,
  closedTitle,
  className,
  testClassName = '',
  testId = 'expandable-section',
  contentTestClassName = '',
  children,
  variant = 'hyperlink',
  type,
  open,
  onClick,
  contentId,
}: ExpandableSectionProps) => {
  const isMain = variant === 'main';
  const isHyperlink = variant === 'hyperlink';
  const isLinkWithoutIcon = variant === 'linkWithoutIcon';
  const isMainLeftIcon = variant === 'mainLeftIcon';
  const groupRotateClass =
    type === 'nested'
      ? `group-open/nested:rotate-[-180deg]`
      : `group-open:rotate-[-180deg]`;
  const chevronClasses = `${groupRotateClass} text-magenta-500 shrink-0`;
  const mainSummaryClasses =
    'text-[18px] hover:underline font-semibold justify-between';
  const mainLeftIconSummaryClasses =
    'text-[18px] hover:underline font-semibold justify-start';
  const hyperLinkSummaryClasses = 'underline hover:no-underline group';

  const summaryClasses = twMerge(
    isMain && mainSummaryClasses,
    isMainLeftIcon && mainLeftIconSummaryClasses,
    isHyperlink && hyperLinkSummaryClasses,
    isLinkWithoutIcon && 'underline',
  );

  return (
    <details
      className={twMerge(
        type === 'nested' ? 'group/nested' : 'group',
        (isMain || isMainLeftIcon) &&
          'border-t-1 border-b-1 mb-[-1px] border-slate-400',
        // @note These classes do not work if the component is uncontrolled.
        open ? 'tool-collapse' : 'tool-expand',
        className,
      )}
      open={open}
      data-testid={testId}
      id={contentId}
    >
      <summary
        className={twMerge(
          testClassName,
          'text-magenta-500 flex [&::-webkit-details-marker]:hidden cursor-pointer py-2 outline-none focus:shadow-expander-focus',
          summaryClasses,
        )}
        onClick={() => onClick}
        onKeyDown={() => onClick}
      >
        {isHyperlink || isMainLeftIcon ? (
          <Icon
            type={IconType.CHEVRON_DOWN}
            className={twMerge(chevronClasses, 'w-5 mr-2')}
          />
        ) : null}

        {closedTitle && (
          <div className="hidden group-open:block">{closedTitle}</div>
        )}
        <div
          className={closedTitle ? 'block group-open:hidden' : 'block'}
          data-testid="summary-block-title"
        >
          {title}
        </div>

        {isMain ? (
          <Icon
            type={IconType.CHEVRON_DOWN}
            className={twMerge(chevronClasses, 'w-6')}
          />
        ) : null}
      </summary>
      <div
        className={twMerge(
          'mb-4 text-gray-800 text-base leading-[28px] tracking-[0.18px] pt-2',
          contentTestClassName,
        )}
      >
        {children}
      </div>
    </details>
  );
};
