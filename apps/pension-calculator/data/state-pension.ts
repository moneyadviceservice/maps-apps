import type { Translate } from 'types/translation';

import { getLocalizedCopy, type LocalizedCopy } from './getLocalizedCopy';

export const STATE_PENSION_FORECAST_URL =
  'https://www.gov.uk/check-state-pension';

export const STATE_PENSION_WEEKLY_AMOUNT_ID = 'statePensionWeeklyAmount';

export const STATE_PENSION_WEEKLY_AMOUNT_LIMIT = 999;

export const statePensionCopy = (z: Translate, maxWeeklyAmount: string) => ({
  heading: z({ en: 'Your State Pension', cy: '' }),
  introBefore: z({ en: 'For the most accurate results, ', cy: '' }),
  forecastLink: z({ en: 'check your State Pension forecast', cy: '' }),
  introAfter: z({
    en: ' on GOV.UK to see how much you’re on track to get and enter the weekly amount below.',
    cy: '',
  }),
  amountLabel: z({ en: 'Weekly amount', cy: '' }),
  assumption: z({
    en: `Or, press continue and we’ll assume you qualify for the maximum amount of State Pension – currently £${maxWeeklyAmount} a week.`,
    cy: '',
  }),
  errorSummaryTitle: z({ en: 'There is a problem', cy: '' }),
});

const statePensionErrorCopy = (
  maxWeeklyAmount: string,
): Record<'amountInvalid' | 'amountTooLarge', LocalizedCopy> => ({
  amountInvalid: {
    en: `Enter an amount in pounds, like ${maxWeeklyAmount}`,
    cy: '',
  },
  amountTooLarge: {
    en: `Enter an amount of £${STATE_PENSION_WEEKLY_AMOUNT_LIMIT} or less`,
    cy: '',
  },
});

export type StatePensionErrorKey = keyof ReturnType<
  typeof statePensionErrorCopy
>;

export const getStatePensionErrorMessage = (
  key: StatePensionErrorKey,
  lang: string,
  maxWeeklyAmount: string,
): string =>
  getLocalizedCopy(statePensionErrorCopy(maxWeeklyAmount)[key], lang);
