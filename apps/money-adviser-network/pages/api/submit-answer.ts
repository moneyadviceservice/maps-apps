import type { NextApiRequest, NextApiResponse } from 'next';

import { setAppDataCookie } from 'utils/session/setAppDataCookie';

import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PAGES } from '../../CONSTANTS';
import { FORM_FIELDS, FORM_GROUPS } from '../../data/questions/types';
import { getCurrentPath } from '../../utils/getCurrentPath';
import { getPrefix } from '../../utils/getPrefix';
import { FLOW } from '../../utils/getQuestions';
import {
  emailField,
  phoneField,
  postcodeField,
  referenceField,
  textField,
} from '../../utils/validation/fieldValidation';
import { getNextPage } from './utils/getNextPage';

interface RequestBody {
  language: string;
  question: string;
  isEmbed: string;
  dataPath?: FLOW;
  prevCookieData?: string;
  savedData?: string;
}

type ParsedRequest = {
  data: DataFromQuery;
  cookieData: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {
    language,
    question,
    dataPath,
    prevCookieData,
    savedData,
  }: RequestBody = request.body;
  const currentFlow = dataPath;
  const prefix = getPrefix(currentFlow ?? FLOW.START);
  const prevData = { ...(savedData && JSON.parse(savedData)) };

  const { data, cookieData, questionNumber, error }: ParsedRequest =
    await parseBodyQuestions(request, response, currentFlow);

  const parsedCookieData = {
    ...(prevCookieData &&
      currentFlow && { [currentFlow]: JSON.parse(prevCookieData) }),
    ...cookieData,
  };

  delete data['error'];

  const nextPage = getNextPage(
    error,
    questionNumber,
    data,
    parsedCookieData,
    currentFlow,
    !!data['changeAnswer'],
    prevData,
  );

  const isGoingToConfirmAnswersPage =
    nextPage === `/${getCurrentPath(currentFlow)}/${PAGES.CONFIRM_ANSWERS}`;
  if (isGoingToConfirmAnswersPage || data['changeAnswer'] === 'q-4') {
    delete data['changeAnswer'];
  }

  const transformedData: DataFromQuery = {
    ...data,
    ...(error && { error: question }),
    ...(data['changeAnswer'] && {
      changeAnswer: `${prefix}${questionNumber + 1}`,
    }),
  };

  const queryString = Object.keys(transformedData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        transformedData && key ? transformedData[key] : '',
      )}`;
    })
    .join('&');

  const urlQueries = `${queryString}`;

  response.redirect(302, `/${language}${nextPage}?${urlQueries}`);
}

const updatePhoneNumberFormat = (number: string) => {
  let phoneNumber = number.trim();

  if (phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.slice(1);
  }

  return phoneNumber.startsWith('+44') ? phoneNumber : `+44${phoneNumber}`;
};

async function parseBodyQuestions(
  request: NextApiRequest,
  response: NextApiResponse,
  currentFlow = FLOW.START,
) {
  if (request.body.telephone) {
    request.body.telephone = updatePhoneNumberFormat(request.body.telephone);
  }

  const { type, answer, savedData } = request.body;
  const { question } = request.body;

  const questionNumber = Number(question?.split('-')[1]);

  let error = false;
  let data = { ...(savedData && JSON.parse(savedData)) };
  let cookieData = {};

  const handleSingleType = async () => {
    if (!answer) {
      error = true;
      return;
    }

    if (currentFlow !== FLOW.START) {
      const isTimeSlot =
        currentFlow === FLOW.TELEPHONE && [5, 8, 9].includes(questionNumber);

      cookieData = await setAppDataCookie(
        request,
        response,
        'data',
        {
          ...(question === 't-4' && {
            whenToSpeak: { value: answer },
            ...(answer === '0' && { timeSlot: undefined }),
          }),
          ...(isTimeSlot && {
            whenToSpeak: { value: '1' },
            timeSlot: { value: answer },
          }),
        },
        currentFlow,
      );
    } else {
      data = { ...data, [question]: answer };
    }
  };

  const handleFormGroups = async (fields: string[], groupType: string) => {
    ({ cookieData, data, error } = await parseQuestions(
      request,
      response,
      data,
      fields,
      groupType,
      currentFlow,
    ));
  };

  switch (type) {
    case 'single':
      await handleSingleType();
      break;

    case 'multiple':
      ({ data, error } = parseBodyMultiQuestions(request, data));
      break;

    case FORM_GROUPS.securityQuestions: {
      await handleFormGroups(
        [
          FORM_FIELDS.postcode,
          FORM_FIELDS.securityQuestion,
          FORM_FIELDS.securityAnswer,
        ],
        FORM_GROUPS.securityQuestions,
      );
      break;
    }

    case FORM_GROUPS.consentDetails:
    case FORM_GROUPS.consentReferral:
    case FORM_GROUPS.consentOnline: {
      await handleFormGroups([`${type}`], type);
      break;
    }

    case FORM_GROUPS.reference: {
      await handleFormGroups(
        [FORM_FIELDS.customerReference, FORM_FIELDS.departmentName],
        FORM_GROUPS.reference,
      );
      break;
    }

    case FORM_GROUPS.customerDetails: {
      const customerFields =
        currentFlow === FLOW.ONLINE
          ? [FORM_FIELDS.firstName, FORM_FIELDS.lastName, FORM_FIELDS.email]
          : [
              FORM_FIELDS.firstName,
              FORM_FIELDS.lastName,
              FORM_FIELDS.telephone,
            ];
      await handleFormGroups(customerFields, type);
      break;
    }

    case 'moneyInput':
      if (answer) {
        data = {
          ...data,
          [question]: `£${answer.replace(/,/g, '')}`,
        };
      } else {
        error = true;
      }
      break;

    default:
      error = true;
  }

  return { data, cookieData, questionNumber, error };
}

function parseBodyMultiQuestions(
  request: NextApiRequest,
  data: Record<string, string | number>,
) {
  const { question, clearAll } = request.body;
  const questionNumber = Number(question?.split('-')[1]);
  let error = false;
  let an = '';

  Object.keys(request.body).forEach((t) => {
    if (t.indexOf('answer') > -1) {
      const answers =
        an.length > 0 ? ',' + String(request.body[t]) : String(request.body[t]);

      an =
        clearAll[request.body[t]] === 'true'
          ? request.body[t]
          : an.concat(answers);
    }
  });

  if (an.length > 0) {
    data = {
      ...data,
      [question]: an,
    };
  } else {
    error = true;
  }

  return {
    data,
    questionNumber,
    error,
  };
}

async function parseQuestions(
  request: NextApiRequest,
  response: NextApiResponse,
  data: Record<string, string | number>,
  fields: string[],
  step: string,
  currentFlow: FLOW,
) {
  const { question } = request.body;
  const questionNumber = Number(question?.split('-')[1]);
  let error = false;

  const answers = fields.reduce((acc, field) => {
    acc[field] = request.body[field] ?? '';
    return acc;
  }, {} as Record<string, string>);

  const cookieData = await setAppDataCookie(
    request,
    response,
    'data',
    {
      [step]: fields.length > 1 ? answers : { value: answers[fields[0]] },
    },
    currentFlow,
  );

  switch (step) {
    case FORM_GROUPS.consentDetails:
    case FORM_GROUPS.consentReferral:
    case FORM_GROUPS.consentOnline: {
      if (answers?.[`${step}`]?.length === 0) {
        error = true;
      }

      break;
    }
    case FORM_GROUPS.securityQuestions: {
      if (
        answers?.[FORM_FIELDS.postcode]?.length === 0 ||
        !postcodeField(answers?.[FORM_FIELDS.postcode]) ||
        answers?.[FORM_FIELDS.securityQuestion]?.length === 0 ||
        answers?.[FORM_FIELDS.securityAnswer]?.length === 0
      ) {
        error = true;
      }

      break;
    }
    case FORM_GROUPS.reference: {
      fields.forEach((field) => {
        if (
          answers[field] &&
          !referenceField(
            answers[field],
            field === FORM_FIELDS.departmentName ? 40 : 20,
          )
        ) {
          error = true;
        }
      });

      break;
    }
    case FORM_GROUPS.customerDetails: {
      fields.forEach((field) => {
        if (
          ((field === FORM_FIELDS.firstName ||
            field === FORM_FIELDS.lastName) &&
            !textField(answers[field])) ||
          (field === FORM_FIELDS.email && !emailField(answers[field])) ||
          (field === FORM_FIELDS.telephone && !phoneField(answers[field]))
        ) {
          error = true;
        }
      });

      break;
    }
  }

  return {
    data,
    cookieData,
    questionNumber,
    error,
  };
}
