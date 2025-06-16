import { QUESTION_PREFIX, SUBMIT_ANSWER_API } from 'CONSTANTS';
import { creditOptionsAnalytics } from 'data/analytics';
import { creditOptionsErrorMessages } from 'data/errors';
import { creditOptionsQuestions } from 'data/questions';

import { Questions } from '@maps-react/form/components/Questions';
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

  const questions = creditOptionsQuestions(z);
  const errors = creditOptionsErrorMessages(z);
  const analyticsData = creditOptionsAnalytics();

  return (
    <CreditOptions step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <Questions
        storedData={storedData}
        data={data}
        questions={questions}
        errors={errors}
        currentStep={currentStep}
        backLink={links.question.backLink}
        apiCall={SUBMIT_ANSWER_API}
        isEmbed={isEmbed}
        analyticsData={analyticsData}
        inputClassName="w-full md:w-72"
      />
    </CreditOptions>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
