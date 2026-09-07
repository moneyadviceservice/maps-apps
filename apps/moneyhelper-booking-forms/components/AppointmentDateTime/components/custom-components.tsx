import { twMerge } from 'tailwind-merge';
import {
  DayButton,
  DayButtonProps,
  NextMonthButton,
  NextMonthButtonProps,
  PreviousMonthButton,
  PreviousMonthButtonProps,
  useDayPicker,
} from '@daypicker/react';
import { ExpandableSection, ListElement } from '@maps-digital/shared/ui';

import { getCalendarHelpTitle, getCalendarLegendItems } from '../content';
import { calendarLegendSwatchClasses } from '../styles';
import type { LocaleCode, TranslationFn } from '../types';

type MonthButtonDirection = 'next' | 'previous';

const monthLabelsByLocale: Record<
  LocaleCode,
  { short: string[]; long: string[] }
> = {
  'en-GB': {
    short: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    long: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  'cy-GB': {
    short: [
      'Ion',
      'Chwef',
      'Maw',
      'Ebr',
      'Mai',
      'Meh',
      'Gor',
      'Awst',
      'Medi',
      'Hyd',
      'Tach',
      'Rhag',
    ],
    long: [
      'Ionawr',
      'Chwefror',
      'Mawrth',
      'Ebrill',
      'Mai',
      'Mehefin',
      'Gorffennaf',
      'Awst',
      'Medi',
      'Hydref',
      'Tachwedd',
      'Rhagfyr',
    ],
  },
};

/**
 * Used to determine if the aria-disabled attribute is set to true, which indicates that the button is disabled. (when the next or previous month is unavailable)
 * @param value - The value of the aria-disabled attribute, which can be a boolean or a string ('true' or 'false').
 * @returns A boolean indicating whether the button is disabled (true) or not (false).
 */
const isAriaDisabled = (value: boolean | 'true' | 'false' | undefined) =>
  value === true || value === 'true';

/**
 * Helper function to get the month label based on the locale and the specified variant (short or long).
 * @param localeCode - The locale code (e.g., 'en-GB' or 'cy-GB').
 * @param month - The Date object representing the month.
 * @param variant - The variant of the month label ('short' or 'long').
 * @returns The month label as a string.
 */
const getMonthLabel = (
  localeCode: LocaleCode,
  month: Date | undefined,
  variant: 'short' | 'long',
) => {
  if (!month) return '';

  return monthLabelsByLocale[localeCode][variant][month.getMonth()];
};

/**
 * Helper function to determine the presentation of month navigation buttons.
 * @param localeCode
 * @param className
 * @param month
 * @returns
 */
const getMonthButtonPresentation = (
  localeCode: LocaleCode,
  className: string | undefined,
  month: Date | undefined,
) => ({
  buttonClasses: twMerge(
    className,
    'flex items-center gap-1 text-magenta-500 underline decoration-1 underline-offset-2',
  ),
  shortMonthLabel: getMonthLabel(localeCode, month, 'short'),
  longMonthLabel: getMonthLabel(localeCode, month, 'long'),
});

/**
 * Factory function to create custom month navigation buttons for the date picker.
 * It generates either a PreviousMonthButton or NextMonthButton based on the specified direction.
 * A short month label is displayed on smaller screens, while the full month name is shown on larger screens.
 * @param localeCode
 * @param direction
 * @returns
 */
const getCustomMonthButton = (
  localeCode: LocaleCode,
  direction: MonthButtonDirection,
) => {
  if (direction === 'previous') {
    const CustomPreviousMonthButton = (props: PreviousMonthButtonProps) => {
      const {
        previousMonth,
        formatters: { formatMonthDropdown },
      } = useDayPicker();

      const { buttonClasses, longMonthLabel, shortMonthLabel } =
        getMonthButtonPresentation(localeCode, props.className, previousMonth);

      return (
        <PreviousMonthButton {...props} className={buttonClasses}>
          {!isAriaDisabled(props['aria-disabled']) && (
            <>
              {props.children}
              {previousMonth && (
                <>
                  <span className="sm:hidden">{shortMonthLabel}</span>
                  <span className="hidden sm:inline">
                    {longMonthLabel || formatMonthDropdown(previousMonth)}
                  </span>
                </>
              )}
            </>
          )}
        </PreviousMonthButton>
      );
    };

    return CustomPreviousMonthButton;
  }

  // direction === 'next'
  const CustomNextMonthButton = (props: NextMonthButtonProps) => {
    const {
      nextMonth,
      formatters: { formatMonthDropdown },
    } = useDayPicker();

    const { buttonClasses, longMonthLabel, shortMonthLabel } =
      getMonthButtonPresentation(localeCode, props.className, nextMonth);

    return (
      <NextMonthButton {...props} className={buttonClasses}>
        {!isAriaDisabled(props['aria-disabled']) && (
          <>
            {nextMonth && (
              <>
                <span className="sm:hidden">{shortMonthLabel}</span>
                <span className="hidden sm:inline">
                  {longMonthLabel || formatMonthDropdown(nextMonth)}
                </span>
              </>
            )}
            {props.children}
          </>
        )}
      </NextMonthButton>
    );
  };

  return CustomNextMonthButton;
};

/**
 * Factory function to create a custom DayButton component for the date picker.
 * The button is styled based on its state (e.g., selected, today, available, unavailable).
 * If the day is today, it includes a label indicating that.
 * @param z
 * @returns
 */
export const getCustomDayButton = (z: TranslationFn) => {
  const CustomDayButton = (props: DayButtonProps) => {
    const { modifiers, className, children } = props;

    const isOutside = Boolean(modifiers.outside);
    const isDisabled = Boolean(modifiers.disabled);
    const isSelected = Boolean(modifiers.selected);
    const isToday = Boolean(modifiers.today) && !isOutside;
    const isAvailable = !isOutside && !isDisabled;
    const isUnavailable = isOutside || isDisabled;

    const buttonClasses = twMerge(
      className,
      'group relative w-full min-h-[40px] overflow-hidden p-1 text-left leading-none aspect-square sm:h-[60px] sm:w-[60px] sm:p-2 sm:aspect-auto',
      isToday
        ? 'flex flex-col items-start justify-between'
        : 'flex items-start justify-start',
      isOutside && 'bg-transparent border-0',
      isUnavailable && 'cursor-not-allowed bg-gray-150 text-gray-800',
      isAvailable &&
        'border border-magenta-500 bg-white text-magenta-500 hover:bg-pink-300 focus-visible:bg-pink-300 focus-visible:outline-2 focus-visible:outline-blue-700',
      isSelected && '!bg-magenta-500 !text-white',
    );

    const todayClasses = twMerge(
      'absolute bottom-0 left-0 flex h-5 w-full items-center justify-center text-xs leading-none sm:h-6 sm:text-sm',
      isSelected && '!bg-pink-400 !text-white',
      isAvailable &&
        'border-t border-magenta-500 text-gray-800 bg-gray-95 group-hover:bg-magenta-300',
      !isAvailable && 'bg-blue-300',
    );

    return (
      <DayButton {...props} className={buttonClasses}>
        <span className="relative z-10">{children}</span>
        {isToday && (
          <span className={todayClasses}>
            {z({ en: 'Today', cy: 'Heddiw' })}
          </span>
        )}
      </DayButton>
    );
  };

  return CustomDayButton;
};
/**
 * Renders the calendar legend, which provides a visual guide to the meaning of different date states (unavailable, available, selected) in the appointment booking calendar.
 * @param param0
 * @returns
 */
export const CalendarLegend = ({ z }: { z: TranslationFn }) => {
  const items = getCalendarLegendItems(z).map(({ key, label }) => (
    <span key={key} className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className={twMerge(
          `min-h-10 min-w-10 sm:h-[60px] sm:w-[60px] shrink-0 border-2`,
          calendarLegendSwatchClasses[key],
        )}
      />
      <span>{label}</span>
    </span>
  ));

  return (
    <ListElement
      items={items}
      color="magenta"
      variant="none"
      className="mt-4 space-y-4"
    />
  );
};

// Export custom components for use in the date picker.
export const CalendarFooter = ({ z }: { z: TranslationFn }) => (
  <ExpandableSection title={getCalendarHelpTitle(z)}>
    <CalendarLegend z={z} />
  </ExpandableSection>
);

export const getCustomPreviousMonthButton = (localeCode: LocaleCode) =>
  getCustomMonthButton(localeCode, 'previous');

export const getCustomNextMonthButton = (localeCode: LocaleCode) =>
  getCustomMonthButton(localeCode, 'next');
