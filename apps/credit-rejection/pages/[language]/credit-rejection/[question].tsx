import { DATA_PATH, QUESTION_PREFIX, SUBMIT_ANSWER_API } from 'CONSTANTS';
import { creditRejectionAnalytics } from 'data/analytics';
import { creditRejectionErrorMessages } from 'data/errors';
import { creditRejectionQuestions } from 'data/questions';

import { Questions } from '@maps-react/form/components/Questions';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { CreditRejection, getServerSidePropsDefault } from '.';

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

  const questions = creditRejectionQuestions(z);
  const errors = creditRejectionErrorMessages(z);
  const analyticsData = creditRejectionAnalytics();

  return (
    <CreditRejection step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <Questions
        storedData={storedData}
        data={data}
        questions={questions}
        errors={errors}
        currentStep={currentStep}
        backLink={links.question.backLink}
        dataPath={DATA_PATH}
        apiCall={SUBMIT_ANSWER_API}
        isEmbed={isEmbed}
        analyticsData={analyticsData}
      />
    </CreditRejection>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
