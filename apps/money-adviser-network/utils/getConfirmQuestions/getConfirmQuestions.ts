import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  onlineQuestions,
  startQuestions,
  telephoneQuestions,
} from '../../data/questions';
import { CookieData } from '../../data/questions/types';
import { formatBookingSlotText } from '../formatBookingSlotText';
import { FLOW } from '../getQuestions';

export type ConfirmQuestions = {
  question: string;
  answer?: string;
  flow: FLOW;
  questionNbr: number;
}[];

const confirmTelephoneQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
  cookieData: CookieData,
  lang: string,
): ConfirmQuestions => {
  return [
    {
      question: startQuestions(z)[3].title,
      answer: startQuestions(z)[3].answers[1].text,
      flow: FLOW.START,
      questionNbr: 4,
    },
    {
      question: z({
        en: 'When would the customer like to speak to someone?',
        cy: "Pryd fyddai'r cwsmer yn hoffi siarad â rhywun?",
      }),
      answer:
        cookieData.whenToSpeak?.value === '0'
          ? telephoneQuestions(z)[3].answers[0].text
          : formatBookingSlotText(`${cookieData.timeSlot?.value}`, true, lang),
      flow: FLOW.TELEPHONE,
      questionNbr: 4,
    },
    {
      question: telephoneQuestions(z)[5].answers[0].text,
      answer: cookieData.customerDetails?.firstName,
      flow: FLOW.TELEPHONE,
      questionNbr: 6,
    },
    {
      question: telephoneQuestions(z)[5].answers[1].text,
      answer: cookieData.customerDetails?.lastName,
      flow: FLOW.TELEPHONE,
      questionNbr: 6,
    },
    {
      question: telephoneQuestions(z)[5].answers[2].text,
      answer: cookieData.customerDetails?.telephone,
      flow: FLOW.TELEPHONE,
      questionNbr: 6,
    },
    {
      question: z({ en: "Customer's postcode", cy: 'Cod post y cwsmer' }),
      answer: cookieData.securityQuestions?.postcode,
      flow: FLOW.TELEPHONE,
      questionNbr: 7,
    },
    {
      question: z({ en: 'Security question', cy: 'Cwestiwn diogelwch' }),
      answer: telephoneQuestions(z)[6].answers.find(
        (ans) => ans.value === cookieData.securityQuestions?.securityQuestion,
      )?.text,
      flow: FLOW.TELEPHONE,
      questionNbr: 7,
    },
    {
      question: z({
        en: 'Answer to security question',
        cy: 'Ateb i gwestiwn diogelwch',
      }),
      answer: cookieData.securityQuestions?.securityAnswer,
      flow: FLOW.TELEPHONE,
      questionNbr: 7,
    },
  ];
};

const confirmOnlineQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
  cookieData: CookieData,
): ConfirmQuestions => {
  return [
    {
      question: startQuestions(z)[3].title,
      answer: startQuestions(z)[3].answers[0].text,
      flow: FLOW.START,
      questionNbr: 4,
    },

    {
      question: onlineQuestions(z)[2].answers[0].text,
      answer: cookieData.customerDetails?.firstName,
      flow: FLOW.ONLINE,
      questionNbr: 3,
    },
    {
      question: onlineQuestions(z)[2].answers[1].text,
      answer: cookieData.customerDetails?.lastName,
      flow: FLOW.ONLINE,
      questionNbr: 3,
    },
    {
      question: onlineQuestions(z)[2].answers[2].text,
      answer: cookieData.customerDetails?.email,
      flow: FLOW.ONLINE,
      questionNbr: 3,
    },
  ];
};

export const getConfirmQuestions = (
  flow: FLOW,
  z: ReturnType<typeof useTranslation>['z'],
  cookieData: CookieData,
  lang: string,
) => {
  let questions = {} as ConfirmQuestions;

  switch (flow) {
    case FLOW.ONLINE: {
      questions = confirmOnlineQuestions(z, cookieData);
      break;
    }
    case FLOW.TELEPHONE: {
      questions = confirmTelephoneQuestions(z, cookieData, lang);
      break;
    }
  }

  return questions;
};
