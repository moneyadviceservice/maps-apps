import { type AboutYouErrorKey, getAboutYouErrorMessage } from 'data/about-you';
import {
  type AboutYouData,
  type AboutYouErrors,
  SEX_FEMALE,
  SEX_MALE,
  type SexValue,
} from 'types/aboutYou';
import { DAY_ID, RETIRE_AGE_ID, SEX_MALE_ID } from 'data/aboutYouFieldIds';
import { getAge, parseCalendarDate, startOfToday } from 'utils/getAge';

const MIN_AGE = 18;
const MAX_AGE = 74;
const MIN_RETIRE_AGE = 55;
const MAX_RETIRE_AGE = 99;

const isBlank = (value: string) => value.trim() === '';

const addError = (
  errors: AboutYouErrors,
  fieldId: string,
  key: AboutYouErrorKey,
  lang: string,
) => {
  const message = getAboutYouErrorMessage(key, lang);
  if (!errors[fieldId]) {
    errors[fieldId] = [message];
    return;
  }
  errors[fieldId].push(message);
};

const parseWholeNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  return Number(trimmed);
};

const validateDateOfBirth = (
  data: AboutYouData,
  errors: AboutYouErrors,
  lang: string,
  now: Date,
) => {
  const birthDate = parseCalendarDate(data.day, data.month, data.year);
  const today = startOfToday(now);

  if (
    isBlank(data.day) ||
    isBlank(data.month) ||
    isBlank(data.year) ||
    !birthDate ||
    birthDate > today
  ) {
    addError(errors, DAY_ID, 'dobFormat', lang);
    return null;
  }

  const currentAge = getAge(birthDate, now);
  if (currentAge < MIN_AGE || currentAge > MAX_AGE) {
    addError(errors, DAY_ID, 'dobAgeRange', lang);
  }

  return currentAge;
};

const validateSex = (sex: SexValue, errors: AboutYouErrors, lang: string) => {
  if (sex !== SEX_MALE && sex !== SEX_FEMALE) {
    addError(errors, SEX_MALE_ID, 'sexRequired', lang);
  }
};

const validateRetirementAge = (
  retireAgeValue: string,
  currentAge: number | null,
  errors: AboutYouErrors,
  lang: string,
) => {
  const retireAge = parseWholeNumber(retireAgeValue);
  if (
    retireAge === null ||
    retireAge < MIN_RETIRE_AGE ||
    retireAge > MAX_RETIRE_AGE ||
    (currentAge !== null && retireAge < currentAge)
  ) {
    addError(errors, RETIRE_AGE_ID, 'retireAgeInvalid', lang);
  }
};

export const validateAboutYou = (
  data: AboutYouData,
  lang = 'en',
  now = new Date(),
): AboutYouErrors => {
  const errors: AboutYouErrors = {};
  const currentAge = validateDateOfBirth(data, errors, lang, now);
  validateSex(data.sex, errors, lang);
  validateRetirementAge(data.retireAge, currentAge, errors, lang);
  return errors;
};

export const hasAboutYouErrors = (errors: AboutYouErrors) =>
  Object.keys(errors).length > 0;
