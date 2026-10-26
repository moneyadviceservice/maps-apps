import {
  DAY_ID,
  MONTH_ID,
  RETIRE_AGE_ID,
  SEX_NAME,
  YEAR_ID,
} from 'data/aboutYouFieldIds';
import {
  type AboutYouData,
  defaultAboutYouData,
  SEX_FEMALE,
  SEX_MALE,
  type SexValue,
} from 'types/aboutYou';
import { asString } from 'utils/formValue';

const parseSex = (value: string): SexValue => {
  if (value === SEX_MALE || value === SEX_FEMALE) {
    return value;
  }
  return '';
};

export const parseAboutYouForm = (
  body: Record<string, unknown>,
): AboutYouData => ({
  day: asString(body[DAY_ID] ?? body.day),
  month: asString(body[MONTH_ID] ?? body.month),
  year: asString(body[YEAR_ID] ?? body.year),
  sex: parseSex(asString(body[SEX_NAME] ?? body.sex)),
  retireAge: asString(body[RETIRE_AGE_ID] ?? body.retireAge),
});

export const ensureAboutYouDefaults = (
  data?: AboutYouData | null,
): AboutYouData => {
  if (!data) {
    return defaultAboutYouData();
  }

  return {
    day: data.day ?? '',
    month: data.month ?? '',
    year: data.year ?? '',
    sex: parseSex(data.sex ?? ''),
    retireAge: data.retireAge ?? '',
  };
};

export const toDateInputDefaultValues = (data: AboutYouData): string => {
  if (!data.day && !data.month && !data.year) {
    return '';
  }

  return `${data.day}-${data.month}-${data.year}`;
};
