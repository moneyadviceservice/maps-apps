import { useState } from 'react';

import { DayPicker, Matcher } from '@daypicker/react';
import { cy, enUS } from '@daypicker/react/locale';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { FormError } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import {
  CalendarFooter,
  getCustomDayButton,
  getCustomNextMonthButton,
  getCustomPreviousMonthButton,
} from './components/custom-components';
import { getKeyboardInstructions } from './content';
import { dayPickerClassNames } from './styles';
import { AppointmentAvailabilityResponse } from './types';
import { buildAppointmentCalendarState, fromDateKey, toDateKey } from './utils';

type AppointmentDateTimeProps = {
  data?: AppointmentAvailabilityResponse;
  errors?: FormError;
  entry?: BookingEntry;
  onDateSelect?: () => void;
  step: string;
};

/**
 * Uses DayPicker to render a calendar for selecting an appointment date and time.
 * Renders a list of available time slots for the selected date once a date is selected.
 * @param data - The appointment availability data fetched from the API.
 * @param entry - The current form entry containing the selected appointment date.
 * @param errors - Any form errors related to the appointment date and time selection.
 * @param onDateSelect - Optional callback fired when a new day is selected.
 * @returns
 */
export const AppointmentDateTime = ({
  data,
  entry,
  errors,
  onDateSelect,
  step,
}: AppointmentDateTimeProps) => {
  const { t, tList, z } = useTranslation();
  const availabilityData = data ?? { days: [] };
  const isWelsh = useLanguage() === 'cy';
  const localeCode = isWelsh ? 'cy-GB' : 'en-GB';
  const dayPickerLocale = isWelsh ? cy : enUS;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Restore selected day from stored entry data when revisiting this step.
  const [selected, setSelected] = useState<Date | undefined>(
    fromDateKey(asString(entry?.data?.appointmentDate)),
  );

  // Update local selection and notify the parent to clear slot-level errors.
  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onDateSelect?.();
  };

  // Build the derived state for the appointment calendar based on availability and selected date.
  const {
    availableDateKeys,
    firstAvailableDate,
    selectedDateKey,
    selectedDateLabel,
    timeOptions,
  } = buildAppointmentCalendarState({
    availabilityData,
    localeCode,
    selected,
  });
  const initialMonth = selected ?? firstAvailableDate ?? today;

  // Determine which days are unavailable based on the available date keys.
  const unavailableDays: Matcher = (date: Date) =>
    !availableDateKeys.has(toDateKey(date));

  // Custom components
  const CustomDayButton = getCustomDayButton(z);
  const CustomPreviousMonthButton = getCustomPreviousMonthButton(localeCode);
  const CustomNextMonthButton = getCustomNextMonthButton(localeCode);

  // Content
  const componentKey = 'components.appointment-date-time';
  const appointmentDaySections = tList(`${componentKey}.date.sections`);
  const appointmentTimeSections = tList(`${componentKey}.time.sections`);
  const radioButtonName = 'appointmentSlotSelection';
  const defaultSlotSelection = asString(entry?.data?.appointmentSlotSelection);
  const radioButtonError = getFieldError(radioButtonName, errors)
    ? t(`${componentKey}.form.radio-button.error`)
    : undefined;

  return (
    <div data-testid="appointment-date-time" className="flex flex-col gap-4">
      <SectionsRenderer
        sections={appointmentDaySections}
        testIdPrefix="appointment-date"
        headingClassName="text-blue-700"
      />
      <p id="appointment-date-instructions" className="sr-only">
        {getKeyboardInstructions(z)}
      </p>
      <DayPicker
        ISOWeek
        mode="single"
        noonSafe
        locale={dayPickerLocale}
        timeZone="Europe/London"
        defaultMonth={initialMonth}
        startMonth={firstAvailableDate ?? today}
        aria-labelledby="appointment-date-time-title"
        aria-describedby="appointment-date-instructions"
        disabled={unavailableDays}
        selected={selected}
        onSelect={handleSelect}
        components={{
          DayButton: CustomDayButton,
          PreviousMonthButton: CustomPreviousMonthButton,
          NextMonthButton: CustomNextMonthButton,
        }}
        classNames={dayPickerClassNames}
        footer={<CalendarFooter z={z} />}
      />

      {(selected || radioButtonError) && (
        <FormWrapper
          step={step}
          className="lg:max-w-3xl"
          nextStep={
            entry?.editMode === true
              ? StepName.CONFIRM_DETAILS
              : StepName.CONTACT_DETAILS
          }
          saveChanges={entry?.editMode === true}
        >
          <input type="hidden" name="appointmentDate" value={selectedDateKey} />
          <div className="flex flex-col gap-8">
            <hr />
            <SectionsRenderer
              sections={appointmentTimeSections}
              testIdPrefix="appointment-time"
              headingClassName="text-blue-700"
            />
            <QuestionRadioButton
              options={timeOptions}
              name={radioButtonName}
              defaultChecked={defaultSlotSelection}
              hasErrorWrapper={true}
              testId="appointment-time"
              error={radioButtonError}
              className="[&>div:last-child]:!block [&>div:last-child]:columns-2 [&>div:last-child]:gap-x-8 [&>div:last-child>div]:mb-4 [&>div:last-child>div]:break-inside-avoid"
            >
              <Markdown
                content={t(`${componentKey}.form.radio-button.label`, {
                  selectedDateLabel,
                })}
              />
            </QuestionRadioButton>
          </div>
        </FormWrapper>
      )}
      <div className="mt-10">
        <SectionsRenderer
          sections={tList(`${componentKey}.help.sections`)}
          testIdPrefix="appointment-help"
          headingClassName="text-blue-700"
        />
      </div>
    </div>
  );
};
