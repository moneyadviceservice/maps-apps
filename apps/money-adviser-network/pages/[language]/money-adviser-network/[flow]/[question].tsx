import { useMemo } from 'react';

import { GetServerSideProps } from 'next';

import { QuestionPage } from 'components/QuestionPage';
import { questionHelp } from 'data/question-help';
import { fetchBookingSlots } from 'utils/api/fetchBookingSlots';
import { getErrors } from 'utils/getErrors';
import { getPrefix } from 'utils/getPrefix';
import { FLOW, getQuestions } from 'utils/getQuestions';
import { isInOfficeHours } from 'utils/isInOfficeHours';
import { validation } from 'utils/validation';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Answer } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

type QuestionPageProps = {
  hasSlots?: boolean;
  answers?: Answer[];
  error?: string;
} & BaseProps;

const Step = ({
  storedData,
  cookieData,
  data,
  currentStep,
  currentFlow,
  links,
  answers,
  error,
  hasSlots,
}: QuestionPageProps) => {
  const { z } = useTranslation();

  const qs = getQuestions(currentFlow, z);
  const helpSection = questionHelp(z)[currentStep];

  const prefix = useMemo(() => getPrefix(currentFlow), [currentFlow]);
  const hasError = storedData?.error === prefix + currentStep;

  const hasFieldErrors = validation(
    currentFlow,
    qs[currentStep - 1]?.questionNbr,
    cookieData,
  );

  const { pageErrors, errors } = getErrors(
    currentFlow,
    hasFieldErrors,
    z,
    currentStep,
    hasError,
  );

  const ErrorSection = (pageErrors || error) && (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={pageErrors ?? error}
      errorKeyPrefix={!Object.keys(hasFieldErrors).length ? prefix : ''}
      classNames="mb-8"
    />
  );

  const question = qs[currentStep - 1];

  const hasCustomAnswersForQuestion = !!answers?.length;
  if (hasCustomAnswersForQuestion) {
    question.answers = answers;
  }

  const isWhenToScheduleACallQuestion =
    currentFlow === FLOW.TELEPHONE && currentStep === 4;
  if (isWhenToScheduleACallQuestion) {
    question.answers[0].disabled = !isInOfficeHours();
    question.answers[1].disabled = !hasSlots;
  }

  return (
    <MoneyAdviserNetwork step={currentStep} currentFlow={currentFlow}>
      <QuestionPage
        storedData={storedData}
        cookieData={cookieData}
        data={data}
        questions={qs}
        errors={errors}
        currentStep={currentStep}
        links={links}
        currentFlow={currentFlow}
        isEmbed={false}
        helpSection={helpSection}
        pageError={ErrorSection}
        prefix={prefix}
        useValueForRadio={hasCustomAnswersForQuestion}
      />
    </MoneyAdviserNetwork>
  );
};

export default Step;

export const getServerSideProps: GetServerSideProps<QuestionPageProps> = async (
  context,
) => {
  const { req } = context;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['host'];
  const baseUrl = `${protocol}://${host}`;

  const basePropsResult = await getServerSidePropsDefault(context);

  if ('redirect' in basePropsResult) {
    return { redirect: basePropsResult.redirect };
  }

  if ('notFound' in basePropsResult) {
    return { notFound: basePropsResult.notFound };
  }

  const baseProps = basePropsResult.props as BaseProps;

  const fetchSlots =
    baseProps.currentFlow === FLOW.TELEPHONE &&
    (baseProps.currentStep === 4 || baseProps.currentStep === 5);

  if (fetchSlots) {
    const { answers, error } = await fetchBookingSlots(baseProps.lang, baseUrl);
    const hasSlots = !!answers?.length;

    if (baseProps.currentStep === 4) {
      return {
        props: {
          ...baseProps,
          hasSlots,
        },
      };
    }

    return {
      props: {
        ...baseProps,
        ...(answers ? { answers } : {}),
        ...(error ? { error } : {}),
      },
    };
  }

  return { props: baseProps };
};
