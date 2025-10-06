import { QUESTION_PREFIX, SUBMIT_ANSWER_API } from 'CONSTANTS';
import { creditOptionsAnalytics } from 'data/analytics';
import { creditOptionsErrorMessages } from 'data/errors';
import { creditOptionsQuestions } from 'data/questions';

import { Analytics } from '@maps-react/core/components/Analytics';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Questions } from '@maps-react/form/components/Questions';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { CreditOptions, getServerSidePropsDefault } from '.';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const { z } = useTranslation();
  const lang = useLanguage();

  const questions = creditOptionsQuestions(z);
  const errors = creditOptionsErrorMessages(z);
  const analyticsData = creditOptionsAnalytics(z, currentStep);
  const linkToLandingPage = `https://www.moneyhelper.org.uk/${lang}/everyday-money/credit/options-for-borrowing-money`;

  const currentError = hasError
    ? errors.find((error) => error.question === 0)
    : undefined;

  const topErrorSummary = (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={{ [currentStep]: [currentError?.message] }}
      errorKeyPrefix="q-"
      classNames="mb-8"
    />
  );

  return (
    <CreditOptions step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <Analytics
        analyticsData={analyticsData}
        currentStep={currentStep}
        formData={storedData}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: true,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Questions
          storedData={storedData}
          data={data}
          questions={questions}
          errors={errors}
          currentStep={currentStep}
          backLink={
            currentStep === 1 ? linkToLandingPage : links.question.backLink
          }
          apiCall={SUBMIT_ANSWER_API}
          isEmbed={isEmbed}
          topInfo={topErrorSummary ?? null}
          inputClassName="w-full md:w-72"
        />
      </Analytics>
    </CreditOptions>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
