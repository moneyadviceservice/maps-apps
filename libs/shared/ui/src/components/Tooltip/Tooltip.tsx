import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Button } from '../Button/Button';
import { Icon, IconType } from '../Icon';

export interface TooltipProps {
  children: React.ReactNode;
  testId?: string;
  contentClasses?: string;
  accessibilityLabelOpen?: string;
  buttonCloseText?: string;
  centerArrow?: boolean;
}

export const Tooltip = ({
  children,
  accessibilityLabelOpen,
  buttonCloseText,
  testId = 'tooltip',
  contentClasses,
  centerArrow = false,
}: TooltipProps) => {
  const { z } = useTranslation();

  const resolvedAccessibilityLabelOpen =
    accessibilityLabelOpen ??
    z({ en: 'Show more information', cy: 'Dangos mwy o wybodaeth' });
  const resolvedButtonCloseLabel =
    buttonCloseText ?? z({ en: 'Close', cy: 'Cau' });

  const [jsEnabled, setJsEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipContentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLLabelElement>(null);
  const id = useId();
  const arrowDefaultLeft = '6.6rem';
  const defaultContentLeft = '-6.2rem';

  const repositionTooltip = useCallback(() => {
    const tooltipContent = tooltipContentRef.current;
    const icon = iconRef.current;

    if (!tooltipContent || !icon) return;

    const tooltipContentRect = tooltipContent.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();

    // only reposition if the tooltip is about to overflow the viewport or if the arrow should be centered
    if (
      centerArrow ||
      tooltipContentRect.left < 16 ||
      tooltipContentRect.right > document.documentElement.clientWidth - 16
    ) {
      const idealLeft =
        iconRect.left + iconRect.width / 2 - tooltipContentRect.width / 2;
      const clampedLeft = Math.max(
        16,
        Math.min(
          idealLeft,
          document.documentElement.clientWidth - tooltipContentRect.width - 16,
        ),
      );

      tooltipContent.style.left = `${clampedLeft - iconRect.left}px`;

      const iconCenter = iconRect.left + iconRect.width / 2;
      const arrowOffset = iconCenter - clampedLeft - 9;
      tooltipContent.style.setProperty('--arrow-left', `${arrowOffset}px`);
    }
  }, [centerArrow]);

  const resetStyles = () => {
    const tooltipContent = tooltipContentRef.current;
    if (!tooltipContent) return;
    tooltipContent.style.setProperty('--arrow-left', arrowDefaultLeft);
    tooltipContent.style.left = defaultContentLeft;
  };

  const checkAndReposition = useCallback(() => {
    requestAnimationFrame(repositionTooltip);
  }, [repositionTooltip]);

  useEffect(() => {
    setJsEnabled(true);

    window.addEventListener('resize', checkAndReposition);

    return () => {
      window.removeEventListener('resize', checkAndReposition);
    };
  }, [checkAndReposition]);

  useEffect(() => {
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (!isOpen) return;

      const container = containerRef.current;
      if (!container) return;

      if (!container.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('mousedown', handleDocumentMouseDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [isOpen]);

  return (
    <span
      className="relative top-[-4px] text-base font-normal"
      ref={containerRef}
      data-testid={testId}
    >
      <input
        type="checkbox"
        data-testid={`${testId}-input`}
        className="sr-only peer"
        checked={isOpen}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        id={id}
      />

      <label
        className="inline text-blue-600 underline cursor-pointer group"
        ref={iconRef}
        aria-controls={`${id}-content`}
        aria-describedby={isOpen ? `${id}-content` : undefined}
        data-testid={`${testId}-icon`}
        htmlFor={id}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          !centerArrow && resetStyles();
          checkAndReposition();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
            !centerArrow && resetStyles();
            checkAndReposition();
          }
        }}
      >
        <Icon
          className={twMerge(
            '!w-[30px] !h-[30px] inline-block [&_circle]:fill-yellow-100 [&_path]:fill-magenta-500 group-focus-within:[&_circle]:fill-magenta-500 group-focus-within:[&_path]:fill-yellow-100 group-hover:[&_circle]:fill-magenta-500 group-hover:[&_path]:fill-yellow-100',
            isOpen && '[&_circle]:fill-magenta-500 [&_path]:fill-yellow-100',
          )}
          type={IconType.INFO_ICON}
        />
        <span className="sr-only">{resolvedAccessibilityLabelOpen} </span>
      </label>

      <span
        ref={tooltipContentRef}
        id={`${id}-content`}
        data-testid={`${testId}-content`}
        role="tooltip"
        tabIndex={isOpen ? 0 : -1}
        className={twMerge(
          'peer-checked:inline-block hidden absolute z-50 p-4 mt-3 text-gray-900 shadow-tooltip bg-yellow-100 border border-yellow-400 rounded-sm w-[300px] lg:w-[564px] top-7',
          `-left-[6.2rem]`,
          contentClasses,
        )}
      >
        <span
          className="absolute z-20 w-4 h-4 rotate-45 bg-yellow-100 border-t border-l border-yellow-400 -top-2"
          style={{ left: `var(--arrow-left, ${arrowDefaultLeft})` }}
        />

        <span className="block text-base leading-[1.6] font-base">
          {children}
        </span>

        {jsEnabled && (
          <span className="block pr-4 mt-2 text-right">
            <Button
              variant="link"
              data-testid={`${testId}-close`}
              onClick={() => {
                setIsOpen(false);
              }}
              className="text-sm font-semibold no-underline hover:underline"
            >
              <span className="inline-flex items-center gap-2">
                <Icon type={IconType.CLOSE} className="w-4" />
                {resolvedButtonCloseLabel}
              </span>
            </Button>
          </span>
        )}
      </span>
    </span>
  );
};
