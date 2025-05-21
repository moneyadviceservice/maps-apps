import type { NextApiRequest, NextApiResponse } from 'next';

import { CHANGE_ANSWER_PARAM, QUESTION_PREFIX } from 'CONSTANTS';
import { navigationRules } from 'utils/NavigationRules';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import {
  calculateAgeAtEmploymentStart,
  calculateAgeToday,
  isEmploymentAfterRedundancy,
  isEmploymentStartInFuture,
  isRedundancyDateValid,
  isValidDate,
} from '../../../utils/validation/dateValidation';
import { getNextPage } from './getNextPage/getNextPage';
import { transformData } from './transformers/transformData';

type ParsedRequest = {
  data: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

type QuestionBody = {
  question: string;
  type: 'single' | 'date' | 'moneyInput';
  subType?: 'dayMonthYear' | 'monthYear' | 'inputFrequency' | 'inputCheckbox';
  answer?: string | string[];
  savedData?: string;
  day?: string;
  month?: string;
  year?: string;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const { language, target, question, isEmbed } = request.body;

    const isEmbedBool = isEmbed === 'true';

    const { data, questionNumber, error }: ParsedRequest =
      parseBodyQuestions(request);

    const isAnswerChanged: boolean = data[CHANGE_ANSWER_PARAM] === question;

    delete data['error'];

    const navRules = navigationRules(questionNumber, data, isAnswerChanged);
    const page = getNextPage(
      error,
      questionNumber,
      navRules,
      isAnswerChanged,
      target,
    );
    const transformedData = transformData(error, data, question);

    const queryParams = new URLSearchParams();

    Object.entries(transformedData as Record<string, string>).forEach(
      ([key, value]) => {
        queryParams.set(key, value);
      },
    );

    if (
      data[`${QUESTION_PREFIX}6`] === '1' ||
      data[`${QUESTION_PREFIX}6`] === '2'
    ) {
      queryParams.delete('q-7');
    }

    response.redirect(
      302,
      `/${language}/${page}?${queryParams.toString()}${addEmbedQuery(
        isEmbedBool,
        '&',
      )}`,
    );
  } catch (error) {
    console.error('Error in submit-answer API:', error);
    response.status(500).json({ error: 'Error in submit-answer API' });
  }
}

function parseBodyQuestions(response: NextApiRequest) {
  const { question, type, subType, answer, savedData, day, month, year } =
    response.body;
  const questionNumber = Number(question?.split('-')[1]);

  let error = false;
  let data: DataFromQuery = { ...(savedData && JSON.parse(savedData)) };

  const handleSingleType = () => {
    if (!answer) {
      error = true;
    }
    data = {
      ...data,
      [question]: answer,
    };
  };

  const isValidDayMonthYear = (formattedDate: string) => {
    const validOfBirth = isValidDate(formattedDate);

    if (!validOfBirth) return false;

    if (calculateAgeToday(formattedDate) < 15) return false;

    return true;
  };

  const isValidMonthYear = (formattedDate: string) => {
    if (questionNumber === 3) {
      if (!isRedundancyDateValid(formattedDate)) {
        return false;
      }
    }

    if (questionNumber === 4) {
      if (calculateAgeAtEmploymentStart(data['q-2'], formattedDate) < 15)
        return false;
      if (isEmploymentAfterRedundancy(data['q-3'], formattedDate)) return false;
      if (isEmploymentStartInFuture(formattedDate)) return false;
    }

    return true;
  };

  const handleDateType = (subType: 'dayMonthYear' | 'monthYear') => {
    let formattedDate;

    if (subType === 'dayMonthYear') {
      formattedDate = `${day}-${month}-${year}`;

      error = !isValidDayMonthYear(formattedDate);
    } else if (subType === 'monthYear') {
      formattedDate = `${month}-${year}`;

      error = !isValidMonthYear(formattedDate);
    }

    data = {
      ...data,
      [question]: formattedDate,
    };
  };

  switch (type) {
    case 'single':
      handleSingleType();
      break;

    case 'date':
      switch (subType) {
        case 'dayMonthYear':
          handleDateType('dayMonthYear');
          break;
        case 'monthYear':
          handleDateType('monthYear');
          break;
        default:
          error = true;
      }
      break;

    case 'moneyInput':
      switch (subType) {
        case 'inputFrequency':
          if (!answer || answer[0] === '') {
            error = true;
          }
          break;

        case 'inputCheckbox':
          if (!answer || answer.length === 0) {
            error = true;
          }
          break;

        default:
          if (answer[0] === '') {
            error = true;
          }
          break;
      }

      data = {
        ...data,
        [question]: answer,
      };

      break;
  }

  return { data, questionNumber, error };
}
