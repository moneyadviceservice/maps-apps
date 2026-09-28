import { amPmRadioField } from 'data/pages/account/firm-details/opening-hours';
import { useErrorSummary } from 'hooks/useErrorSummary';
import { InputField } from 'types/register';

import { Paragraph } from '@maps-react/common/index';
import { Select } from '@maps-react/form/components/Select';

import { FieldError } from '../FieldError';
import { RadioQuestion } from '../RadioQuestion';

type Props = {
  inputField: InputField;
  initialValue?: string | null; // Expected in 24-hour format "HH:mm" (e.g. "14:30")
};

type Option = {
  text: string;
  value: string;
};

// --- Configuration ---

const HOUR_OPTIONS: Option[] = Array.from({ length: 12 }, (_, i) => {
  const hour = String(i + 1);
  return { text: hour, value: hour };
});

// Minutes: 00, 15, 30, 45
const MINUTE_OPTIONS: Option[] = ['00', '15', '30', '45'].map((min) => ({
  text: min,
  value: min,
}));

// --- Helpers ---

/**
 * Converts 24-hour time "HH:mm" into 12-hour parts: { hour12, minutes, period }
 */
const parse24HourTime = (time24?: string | null) => {
  if (!time24)
    return { hour12: undefined, minutes: undefined, period: undefined };

  const [hStr = '0', mStr = '00'] = time24.split(':');
  const h24 = Number.parseInt(hStr, 10);

  const period = h24 >= 12 ? 'pm' : 'am';
  const h12Raw = h24 % 12;
  const h12 = String(h12Raw === 0 ? 12 : h12Raw);

  return {
    hour12: String(Number.isNaN(h12) ? 0 : h12),
    minutes: MINUTE_OPTIONS.some((opt) => opt.value === mStr) ? mStr : '00',
    period,
  };
};

/**
 * Reads the current value of an uncontrolled DOM element.
 * Safely falls back to the initial value during SSR or first render.
 */
const getUncontrolledValue = (
  id: string,
  fallback?: string,
): string | undefined => {
  if (typeof document === 'undefined') return fallback;

  const element = document.getElementById(id) as HTMLSelectElement | null;
  return element ? element.value : fallback;
};

export const TimeInput = ({ inputField, initialValue }: Props) => {
  const { fieldErrors } = useErrorSummary();

  // 1. Identifiers
  const hoursId = `${inputField.key}_hours`;
  const minutesId = `${inputField.key}_minutes`;
  const amPmFieldKey = `${inputField.key}_${amPmRadioField.key}`;

  // 2. State & Values
  const { hour12, minutes, period } = parse24HourTime(initialValue);

  // Get the LIVE dom values on re-render, fallback to initialValue on first mount
  const currentHour = getUncontrolledValue(hoursId, hour12);
  const currentMinutes = getUncontrolledValue(minutesId, minutes);

  // 3. Error Resolutions
  const selectError = fieldErrors?.[inputField.key]?.[0];
  const amPmRadioError = fieldErrors?.[amPmFieldKey]?.[0];

  const hideHourError = !!currentHour && !currentMinutes;
  const hideMinuteError = !!currentMinutes && !currentHour;

  const errorKey =
    !selectError && amPmRadioError ? amPmFieldKey : inputField.key;

  const fieldsetErrorState = !!(
    selectError &&
    !amPmRadioError &&
    currentHour &&
    currentMinutes
  );

  // 4. Render
  return (
    <div className="flex items-stretch gap-4">
      <FieldError fieldKey={errorKey} className="mt-8">
        <fieldset className="my-8">
          <legend className="mb-2">{inputField.title}</legend>
          {inputField.hint && (
            <Paragraph className="text-gray-650 mb-4">
              {inputField.hint}
            </Paragraph>
          )}
          <div className="flex items-center gap-4">
            <Select
              key={`${inputField.key}_hours`}
              name={`${inputField.key}_hours`}
              id={`${inputField.key}_hours`}
              data-testid={`${inputField.key}_hours`}
              defaultValue={hour12}
              className={'my-0 w-28'}
              emptyItemText={'HH'}
              options={HOUR_OPTIONS.map(({ text, value }) => ({
                text,
                value,
              }))}
              hasError={!!selectError && !hideHourError}
              hasErrorWrapper={true}
              label={`${inputField.title} hours`}
              hideLabel={true}
              aria-label={`${inputField.title} hours`}
            />

            <Select
              key={`${inputField.key}_minutes`}
              name={`${inputField.key}_minutes`}
              id={`${inputField.key}_minutes`}
              data-testid={`${inputField.key}_minutes`}
              defaultValue={minutes}
              className={'my-0 w-28'}
              emptyItemText={'MM'}
              options={MINUTE_OPTIONS.map(({ text, value }) => ({
                text,
                value,
              }))}
              hasError={!!selectError && !hideMinuteError}
              hasErrorWrapper={true}
              label={`${inputField.title} minutes`}
              hideLabel={true}
              aria-label={`${inputField.title} minutes`}
            />
            <RadioQuestion
              radioInput={{
                ...amPmRadioField,
                key: amPmFieldKey,
                title: `${inputField.title} am/pm`,
              }}
              initialValue={period}
              gap={'mr-4'}
              displayErrorState={fieldsetErrorState}
              useFieldset={false}
              testId={inputField.key}
            />
          </div>
        </fieldset>
      </FieldError>
    </div>
  );
};
