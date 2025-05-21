import { useMemo } from 'react';

import { GetServerSideProps } from 'next';

import { IssueBookingSection } from 'components/IssueBookingSection';
import { QuestionPage } from 'components/QuestionPage';
import { PATHS } from 'CONSTANTS';
import { MANAnalytics } from 'data/analytics/analytics';
import { questionStepData } from 'data/analytics/stepData';
import { questionHelp } from 'data/question-help';
import { getAppointmentSlots } from 'lib/getAppointmentSlots';
import { getErrors } from 'utils/getErrors';
import { getPrefix } from 'utils/getPrefix';
import { FLOW, getQuestions } from 'utils/getQuestions';
import { isInOfficeHours } from 'utils/isInOfficeHours';
import { validation } from 'utils/validation';

import { Analytics } from '@maps-react/core/components/Analytics';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Answer } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

type QuestionPageProps = {
  hasAvailableSlots?: boolean;
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
  hasAvailableSlots,
  lang,
  test,
  userId,
}: QuestionPageProps) => {
  const { z } = useTranslation();
  const { z: enTranslation } = useTranslation('en');

  const qs = getQuestions(currentFlow, z);
  const question = qs[currentStep - 1];
  const helpSection = questionHelp(z)[currentStep];

  const prefix = useMemo(() => getPrefix(currentFlow), [currentFlow]);
  const hasError = storedData?.error === prefix + currentStep;

  const hasFieldErrors = validation(
    currentFlow,
    question?.questionNbr,
    cookieData,
  );

  const { pageErrors, errors, acdlErrors } = getErrors(
    currentFlow,
    hasFieldErrors,
    z,
    currentStep,
    hasError,
    question?.title,
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
      titleLevel="h2"
    />
  );

  const hasCustomAnswersForQuestion = !!answers?.length;
  if (hasCustomAnswersForQuestion) {
    question.answers = answers;
  }

  const overrideOfficeHours = test === 'immediate';
  const isWhenToScheduleACallQuestion =
    currentFlow === FLOW.TELEPHONE && currentStep === 4;
  if (isWhenToScheduleACallQuestion) {
    question.answers[0].disabled = !overrideOfficeHours && !isInOfficeHours();
    question.answers[1].disabled = !hasAvailableSlots;
  }

  const isTelephoneBookingQuestion =
    currentFlow === FLOW.START && currentStep === 4;
  if (isTelephoneBookingQuestion) {
    question.answers[1].disabled =
      !overrideOfficeHours && !isInOfficeHours() && !hasAvailableSlots;
  }

  const includeBottomSection =
    currentFlow === FLOW.TELEPHONE && (currentStep === 8 || currentStep === 9);

  const analyticsStepData = questionStepData(
    z,
    enTranslation,
    currentStep,
    currentFlow,
  );

  return (
    <MoneyAdviserNetwork step={currentStep} currentFlow={currentFlow}>
      <Analytics
        analyticsData={MANAnalytics(
          z,
          currentStep,
          analyticsStepData,
          currentFlow,
          userId,
        )}
        currentStep={currentStep}
        formData={storedData}
        errors={acdlErrors}
      >
        <QuestionPage
          storedData={storedData}
          cookieData={cookieData}
          data={data}
          questions={qs}
          errors={errors}
          currentStep={currentStep}
          links={links}
          currentFlow={currentFlow}
          helpSection={helpSection}
          pageError={ErrorSection}
          prefix={prefix}
          useValueForRadio={hasCustomAnswersForQuestion}
        />

        {includeBottomSection && (
          <Container>
            <div className="mt-8 lg:max-w-[840px]">
              <IssueBookingSection lang={lang} noSlots={currentStep === 9} />
            </div>
          </Container>
        )}
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default Step;

export const getServerSideProps: GetServerSideProps<QuestionPageProps> = async (
  context,
) => {
  const basePropsResult = await getServerSidePropsDefault(context);

  if ('redirect' in basePropsResult) {
    return { redirect: basePropsResult.redirect };
  }

  if ('notFound' in basePropsResult) {
    return { notFound: basePropsResult.notFound };
  }

  const baseProps = basePropsResult.props as BaseProps;

  const telQuestionsToFetchSlots = [4, 5, 8, 9];
  const startQuestionsToFetchSlots = [4];

  const fetchSlots =
    (baseProps.currentFlow === FLOW.TELEPHONE &&
      telQuestionsToFetchSlots.includes(baseProps.currentStep)) ||
    (baseProps.currentFlow === FLOW.START &&
      startQuestionsToFetchSlots.includes(baseProps.currentStep));

  if (fetchSlots) {
    const { answers, error } = await getAppointmentSlots(baseProps.lang);
    const hasAvailableSlots =
      !!answers?.length && answers.some((slot) => slot.availability !== '0');

    if (
      !hasAvailableSlots &&
      (baseProps.currentStep === 8 || baseProps.currentStep === 9)
    ) {
      return {
        redirect: {
          destination: `/${baseProps.lang}/${PATHS.TELEPHONE}/call-could-not-be-scheduled?error=noSlots`,
          permanent: false,
        },
      };
    }

    if (baseProps.currentStep === 4) {
      return {
        props: {
          ...baseProps,
          hasAvailableSlots,
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
