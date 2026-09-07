import { RadioInput } from 'components/form/RadioQuestion';
import { InputField } from 'types/register';

import { yesNoOptions } from '../tripCover/service-details';

export const openingHoursPage = {
  title: 'Opening hours',
  description: 'Enter the opening hours for your principle place of business.',
  backLink: '/account/firm-details/principle-place-of-business',
  formKey: 'opening-hours',
  submitApi: '/api/account/firm-details/opening-hours',
  nextStep: '/account/firm-details/confirm-details',
  currentRoute: '/account/firm-details/opening-hours',
};

export const openingTimeField: InputField = {
  key: 'opening_time',
  title: 'Opening time',
  heading: 'Monday to Friday opening hours',
  type: 'hour_min',
  dataPath: 'office/opening_times/weekday',
  required: true,
  hint: 'For example, 10 00 AM',
  customValidation: {
    validationType: 'lessThan',
    compareTo: 'closing_time',
  },
};

export const closingTimeField: InputField = {
  key: 'closing_time',
  title: 'Closing time',
  type: 'hour_min',
  dataPath: 'office/opening_times/weekday',
  required: true,
  hint: 'For example, 5 00 PM',
  customValidation: {
    validationType: 'greaterThan',
    compareTo: 'opening_time',
  },
};

const amPmOptions = [
  { label: 'AM', value: 'am' },
  { label: 'PM', value: 'pm' },
];

export const amPmRadioField: InputField & RadioInput = {
  key: 'am_pm',
  title: '',
  type: 'am_pm',
  layout: 'row',
  options: amPmOptions,
  required: true,
};

export const saturdayOpeningRadioField: InputField & RadioInput = {
  key: 'saturday_opening',
  title: 'Saturday opening hours',
  type: 'radio',
  layout: 'row',
  dataPath: 'office/opening_times/weekend',
  options: yesNoOptions,
  required: true,
};

export const saturdayOpeningField: InputField = {
  key: 'saturday_opening_time',
  title: 'Saturday opening time',
  type: 'hour_min',
  dataPath: 'office/opening_times/weekend',
  hideWhen: { field: saturdayOpeningRadioField, value: 'no' },
  customValidation: {
    validationType: 'lessThan',
    compareTo: 'saturday_closing_time',
  },
};

export const saturdayClosingField: InputField = {
  key: 'saturday_closing_time',
  title: 'Saturday closing time',
  type: 'hour_min',
  dataPath: 'office/opening_times/weekend',
  hideWhen: { field: saturdayOpeningRadioField, value: 'no' },
  customValidation: {
    validationType: 'greaterThan',
    compareTo: 'saturday_opening_time',
  },
};

export const sundayOpeningRadioField: InputField & RadioInput = {
  key: 'sunday_opening',
  title: 'Sunday opening hours',
  type: 'radio',
  layout: 'row',
  dataPath: 'office/opening_times/weekend',
  options: yesNoOptions,
  required: true,
};

export const sundayOpeningField: InputField = {
  key: 'sunday_opening_time',
  title: 'Sunday opening time',
  type: 'hour_min',
  dataPath: 'office/opening_times/weekend',
  hideWhen: { field: sundayOpeningRadioField, value: 'no' },
  customValidation: {
    validationType: 'lessThan',
    compareTo: 'sunday_closing_time',
  },
};

export const sundayClosingField: InputField = {
  key: 'sunday_closing_time',
  title: 'Sunday closing time',
  type: 'hour_min',
  dataPath: 'office/opening_times/weekend',
  hideWhen: { field: sundayOpeningRadioField, value: 'no' },
  customValidation: {
    validationType: 'greaterThan',
    compareTo: 'sunday_opening_time',
  },
};

const hideErrorWhenObj = {
  relatedFieldIsInvalid: true,
  relatedFieldKey: '',
};

export const openingAmPmRadioField = {
  ...amPmRadioField,
  key: `${openingTimeField.key}_${amPmRadioField.key}`,
  customValidation: {
    hideErrorWhen: {
      ...hideErrorWhenObj,
      relatedFieldKey: openingTimeField.key,
    },
  },
};
export const closingAmPmRadioField = {
  ...amPmRadioField,
  key: `${closingTimeField.key}_${amPmRadioField.key}`,
  customValidation: {
    hideErrorWhen: {
      ...hideErrorWhenObj,
      relatedFieldKey: closingTimeField.key,
    },
  },
};

export const saturdayOpeningAmPmRadioField = {
  ...amPmRadioField,
  key: `${saturdayOpeningField.key}_${amPmRadioField.key}`,
  customValidation: {
    hideErrorWhen: {
      ...hideErrorWhenObj,
      relatedFieldKey: saturdayOpeningField.key,
    },
  },
};
export const saturdayClosingAmPmRadioField = {
  ...amPmRadioField,
  key: `${saturdayClosingField.key}_${amPmRadioField.key}`,
  customValidation: {
    hideErrorWhen: {
      ...hideErrorWhenObj,
      relatedFieldKey: saturdayClosingField.key,
    },
  },
};

export const sundayOpeningAmPmRadioField = {
  ...amPmRadioField,
  key: `${sundayOpeningField.key}_${amPmRadioField.key}`,
  customValidation: {
    hideErrorWhen: {
      ...hideErrorWhenObj,
      relatedFieldKey: sundayOpeningField.key,
    },
  },
};

export const sundayClosingAmPmRadioField = {
  ...amPmRadioField,
  key: `${sundayClosingField.key}_${amPmRadioField.key}`,
  customValidation: {
    hideErrorWhen: {
      ...hideErrorWhenObj,
      relatedFieldKey: sundayClosingField.key,
    },
  },
};

export const OPENING_HOURS_ERROR_MESSAGES: Record<
  string,
  string | Record<string, string>
> = {
  required: {
    opening_time_am_pm: 'Please select AM or PM for your opening time',
    opening_time: 'Please enter an opening time',
    closing_time_am_pm: 'Please select AM or PM for your closing time',
    closing_time: 'Please enter a closing time',
    saturday_opening: 'Please select whether you are open on Saturdays',
    saturday_opening_time: 'Please enter a Saturday opening time',
    saturday_opening_time_am_pm:
      'Please select AM or PM for your Saturday opening time',
    saturday_closing_time: 'Please enter a Saturday closing time',
    saturday_closing_time_am_pm:
      'Please select AM or PM for your Saturday closing time',
    sunday_opening: 'Please select whether you are open on Sundays',
    sunday_opening_time: 'Please enter a Sunday opening time',
    sunday_opening_time_am_pm:
      'Please select AM or PM for your Sunday opening time',
    sunday_closing_time: 'Please enter a Sunday closing time',
    sunday_closing_time_am_pm:
      'Please select AM or PM for your Sunday closing time',
  },
  invalid: {
    opening_time: 'Please enter a valid opening time',
    closing_time: 'Please enter a valid closing time',
    saturday_opening_time: 'Please enter a valid Saturday opening time',
    saturday_closing_time: 'Please enter a valid Saturday closing time',
    sunday_opening_time: 'Please enter a valid Sunday opening time',
    sunday_closing_time: 'Please enter a valid Sunday closing time',
  },
  custom_error: {
    opening_time: 'Please enter an opening time before your closing time',
    closing_time: 'Please enter a closing time after your opening time',
    saturday_opening_time:
      'Please enter a Saturday opening time before your Saturday closing time',
    saturday_closing_time:
      'Please enter a Saturday closing time after your Saturday opening time',
    sunday_opening_time:
      'Please enter a Sunday opening time before your Sunday closing time',
    sunday_closing_time:
      'Please enter a Sunday closing time after your Sunday opening time',
  },
};
