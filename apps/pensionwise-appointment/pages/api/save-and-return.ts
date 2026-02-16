import type { NextApiRequest, NextApiResponse } from 'next';

import { NotifyClient } from 'notifications-node-client';

import {
  PROGRESS_SAVED_PAGES,
  SAVE_PAGE_OPTIONS,
} from '../../utils/saveConstants';

const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);

const PROCESS_COMPLETED = {
  [SAVE_PAGE_OPTIONS.GET_NEXT_STEPS]: PROGRESS_SAVED_PAGES.NEXT_STEPS,
  [SAVE_PAGE_OPTIONS.SAVE_AND_RETURN]: PROGRESS_SAVED_PAGES.PROGRESS_SAVED,
};
type ProcessCompletedKey = keyof typeof PROCESS_COMPLETED;

const getOption = (isComplete: boolean, value: boolean) =>
  isComplete ? value : undefined;

const getPensionOptions = (params: URLSearchParams, isComplete: boolean) => ({
  retire_later: getOption(isComplete, params.get('t6q1') === '1'),
  guaranteed_income: getOption(isComplete, params.get('t7q1') === '1'),
  flexible_income: getOption(isComplete, params.get('t8q1') === '1'),
  lump_sum: getOption(isComplete, params.get('t9q1') === '1'),
  pot_in_one_go: getOption(isComplete, params.get('t10q1') === '1'),
  mix_options: getOption(isComplete, params.get('t11q1') === '1'),
});

const getNextSteps = (params: URLSearchParams, isComplete: boolean) => ({
  kept_track_of_all_pensions: getOption(
    isComplete,
    params.get('t1q1') === '2' || params.get('t1q1') === '3',
  ),
  interested_in_pension_transfer: getOption(
    isComplete,
    params.get('t1q2') === '1' || params.get('t1q2') === '3',
  ),
  created_retirement_budget: getOption(isComplete, params.get('t2q1') === '2'),
  know_how_much_state_pension: getOption(
    isComplete,
    params.get('t2q2') === '2',
  ),
  received_state_benefits: getOption(isComplete, params.get('t2q3') === '1'),
  pension_to_pay_off_debts: getOption(
    isComplete,
    params.get('t3q1') === '1' || params.get('t3q1') === '3',
  ),
  living_or_planning_overseas: getOption(
    isComplete,
    params.get('t4q1') === '1',
  ),
  finalised_a_will: getOption(isComplete, params.get('t5q1') === '2'),
  setup_power_of_attorney: getOption(isComplete, params.get('t5q2') === '2'),
  updated_beneficiaries: getOption(isComplete, true),
  regulated_financial_advice: getOption(isComplete, true),
});

const validateEmail = (email: string) => {
  // email validation regex adapted from https://regex101.com/r/SOgUIV/2 with duplicates removed
  return /^((?!\.)[\w\-.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.])$/.exec(
    email.toLowerCase(),
  );
};
const getTemplateId = (language: string, isComplete: boolean) => {
  const templateIdSet = isComplete
    ? {
        en: process.env.NOTIFY_TEMPLATE_ID_COMPLETE,
        cy: process.env.NOTIFY_TEMPLATE_ID_CY_COMPLETE,
      }
    : {
        en: process.env.NOTIFY_TEMPLATE_ID,
        cy: process.env.NOTIFY_TEMPLATE_ID_CY,
      };

  return language === 'cy' ? templateIdSet.cy : templateIdSet.en;
};
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    body: { language, email, slug },
    headers: { referer },
  } = request;

  const { search, pathname } = new URL(referer ?? '');
  const params = new URLSearchParams(search);

  const BASE_URL = `/${language}/${process.env.appUrl}`;

  if (!validateEmail(email)) {
    // if email is invalid, return user to same page, with error param added if email is incorrect.
    params.set('error', 'email');
    response.redirect(302, `${pathname}?${params.toString()}`);
  } else {
    // email is valid, clear error, don't display language, set returning param
    params.delete('error');
    params.delete('language');
    params.set('returning', 'true');
    const isComplete = params.get('complete') === 'true';

    const saveReturnLink = `${request.headers.origin}${BASE_URL}${
      isComplete ? '/summary' : ''
    }?${params.toString()}`;
    const pensionOptions = getPensionOptions(params, isComplete);
    const nextSteps = getNextSteps(params, isComplete);
    const templateId = getTemplateId(language, isComplete);

    // send email to gov.notify

    notifyClient
      .sendEmail(templateId, email, {
        personalisation: {
          save_return_link: saveReturnLink,
          urnRef: params.get('urn') ?? 'N/A',
          ...pensionOptions,
          ...nextSteps,
        },
        reference: null,
      })
      .then(() => {
        // send to success page
        params.delete('returning');
        // Ensure slug is a valid key or use default
        const processKey = (
          slug && slug in PROCESS_COMPLETED ? slug : 'save'
        ) as ProcessCompletedKey;
        const page = `progress/${PROCESS_COMPLETED[processKey]}`;
        const queryParams = params?.toString() ? `?${params.toString()}` : '';
        response.redirect(302, `${BASE_URL}/${page}${queryParams}`);
      })
      .catch(() => {
        // return to page with error
        params.delete('returning');
        params.set('error', 'true');
        response.redirect(302, `${pathname}?${params.toString()}`);
      });
  }
}
