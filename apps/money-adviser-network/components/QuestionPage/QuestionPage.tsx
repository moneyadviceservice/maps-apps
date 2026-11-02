import { ReactNode } from 'react';

import { Questions } from '@maps-react/form/components/Questions';
import { ErrorType, Question } from '@maps-react/form/types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { ConsentWrapper } from '../../components/ConsentWrapper';
import { QuestionCustomerDetails } from '../../components/QuestionCustomerDetails';
import { QuestionMultipleSecurity } from '../../components/QuestionMultipleSecurity';
import { QuestionReferenceDetails } from '../../components/QuestionReferenceDetails';
import { QuestionsWrapper } from '../../components/QuestionsWrapper';
import { APIS } from '../../CONSTANTS';
import {
  CookieData,
  FORM_FIELDS,
  FORM_GROUPS,
} from '../../data/questions/types';
import { ToolLinks } from '../../utils/generateToolLinks';
import { FLOW } from '../../utils/getQuestions';

type Props = {
  storedData: DataFromQuery;
  cookieData: CookieData;
  data: string;
  currentStep: number;
  links: ToolLinks;
  currentFlow: FLOW;
  questions: Question[];
  errors: ErrorType[];
  prefix: string;
  helpSection?: ReactNode;
  pageError?: ReactNode;
  useValueForRadio?: boolean;
};

export const QuestionPage = ({
  storedData,
  cookieData,
  data,
  currentStep,
  links,
  currentFlow,
  questions,
  errors,
  helpSection,
  pageError,
  prefix,
  useValueForRadio,
}: Props) => {
  const question = questions[currentStep - 1];
  const useStandalone = question?.type === 'standalone';

  if (useStandalone) {
    return (
      <QuestionsWrapper
        storedData={{ ...storedData, ...cookieData }}
        data={data}
        prevCookieData={JSON.stringify(cookieData)}
        currentStep={currentStep}
        questions={questions}
        links={links}
        currentFlow={currentFlow}
        pageError={pageError}
        prefix={prefix}
      >
        {question.subType === FORM_GROUPS.securityQuestions && (
          <QuestionMultipleSecurity
            question={question}
            cookieData={cookieData?.securityQuestions}
            errors={errors}
          />
        )}
        {question.subType === FORM_GROUPS.customerDetails && (
          <QuestionCustomerDetails
            cookieData={cookieData?.customerDetails}
            errors={errors}
            variant={currentFlow === FLOW.ONLINE ? FLOW.ONLINE : FLOW.TELEPHONE}
          />
        )}

        {question.subType === FORM_FIELDS.consentReferral && (
          <ConsentWrapper
            question={question}
            cookieData={cookieData?.consentReferral}
            variant={question?.subType}
            errors={errors}
          />
        )}

        {question.subType === FORM_FIELDS.consentDetails && (
          <ConsentWrapper
            question={question}
            cookieData={cookieData?.consentDetails}
            variant={question?.subType}
            errors={errors}
          />
        )}

        {question.subType === FORM_FIELDS.consentOnline && (
          <ConsentWrapper
            question={question}
            cookieData={cookieData?.consentOnline}
            variant={question?.subType}
            errors={errors}
          />
        )}

        {question.subType === 'reference' && (
          <QuestionReferenceDetails
            cookieData={cookieData?.reference}
            errors={errors}
          />
        )}
      </QuestionsWrapper>
    );
  }

  let cookieDataWithPrefixRecord = cookieData;
  if (
    currentFlow === FLOW.TELEPHONE &&
    (currentStep === 4 || currentStep === 5)
  ) {
    cookieDataWithPrefixRecord = {
      ...cookieData,
      ...(currentStep === 4 && {
        [`${prefix}4`]: cookieData['whenToSpeak']?.value,
      }),
      ...(currentStep === 5 && {
        [`${prefix}5`]: cookieData['timeSlot']?.value,
      }),
    };
  }

  return (
    <Questions
      storedData={{ ...storedData, ...cookieDataWithPrefixRecord }}
      data={data}
      questions={questions}
      errors={errors}
      currentStep={currentStep}
      backLink={links.question.backLink}
      dataPath={currentFlow}
      apiCall={`/${APIS.SUBMIT_ANSWER}`}
      isEmbed={false}
      alwaysDisplaySubText={true}
      bottomInfo={helpSection}
      topInfo={pageError}
      QUESTION_PREFIX={prefix}
      useValue={useValueForRadio}
    />
  );
};
