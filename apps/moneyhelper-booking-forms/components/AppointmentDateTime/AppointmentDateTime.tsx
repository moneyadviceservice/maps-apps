import { useState } from 'react';

import { DayPicker, Matcher } from '@daypicker/react';
import { cy, enUS } from '@daypicker/react/locale';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { BookingSlots } from '../../lib/api';
import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../lib/constants';
import type { BookingStepProps as BaseBookingStepProps } from '../../lib/types';
import {
  CalendarFooter,
  getCustomDayButton,
  getCustomNextMonthButton,
  getCustomPreviousMonthButton,
} from './components/custom-components';
import { getKeyboardInstructions } from './content';
import { dayPickerClassNames } from './styles';
import { AppointmentAvailability } from './types';
import {
  buildAppointmentCalendarState,
  fromDateKey,
  toDateKey,
  transformAppointmentData,
} from './utils';

type AppointmentDateTimeProps = BaseBookingStepProps & {
  onDateSelect?: () => void;
};

/**
 * Uses DayPicker to render a calendar for selecting an appointment date and time.
 * Renders a list of available time slots for the selected date once a date is selected.
 * @param entry - The current form entry containing the selected appointment date.
 * @param errors - Any form errors related to the appointment date and time selection.
 * @param onDateSelect - Optional callback fired when a new day is selected.
 * @returns
 */
export const AppointmentDateTime = ({
  entry,
  errors,
  step,
  onDateSelect,
}: AppointmentDateTimeProps) => {
  // Extract the booking slots data from the form entry's meta response.
  const data: BookingSlots = entry?.meta?.responseData?.bookingSlots ?? [];

  // Transform the raw booking slots data into a structured availability format.
  const availabilityData: AppointmentAvailability =
    transformAppointmentData(data);

  const { t, tList, z } = useTranslation();
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
  const contentKey = `components.${step}`;

  // Error
  const appointmentSlotError = getFieldError(
    FormFieldName.APPOINTMENT_SLOT_SELECTION,
    errors,
  )
    ? t(
        `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.appointmentSlotSelection}.error`,
      )
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer
        sections={tList(`${contentKey}.date.sections`)}
        testIdPrefix={step}
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

      {(selected || appointmentSlotError) && (
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
          <input
            type="hidden"
            name={FormFieldName.APPOINTMENT_DATE}
            value={selectedDateKey}
          />
          <div className="flex flex-col gap-8">
            <hr />
            <SectionsRenderer
              sections={tList(`${contentKey}.time.sections`)}
              testIdPrefix={FormFieldName.APPOINTMENT_SLOT_SELECTION}
              headingClassName="text-blue-700"
            />
            <QuestionRadioButton
              options={timeOptions}
              name={FormFieldName.APPOINTMENT_SLOT_SELECTION}
              hasErrorWrapper={true}
              testId="appointment-time"
              error={appointmentSlotError}
              className="[&>div:last-child]:!block [&>div:last-child]:columns-2 [&>div:last-child]:gap-x-8 [&>div:last-child>div]:mb-4 [&>div:last-child>div]:break-inside-avoid"
            >
              <Markdown
                content={t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.appointmentSlotSelection}.label`,
                  {
                    selectedDateLabel,
                  },
                )}
              />
            </QuestionRadioButton>
          </div>
        </FormWrapper>
      )}
      <div className="mt-10">
        <SectionsRenderer
          sections={tList(`${contentKey}.help.sections`)}
          testIdPrefix="appointment-help"
          headingClassName="text-blue-700"
        />
      </div>
    </div>
  );
};
