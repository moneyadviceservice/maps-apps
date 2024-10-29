import { Questions } from '@maps-react/form/components/Questions';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';
import { getQuestions } from 'utils/getQuestions';
import { getErrors } from 'utils/getErrors';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { useAnalytics, AnalyticsPageData } from 'hooks/useAnalytics';
import { SUBMIT_ANSWER_API } from 'CONSTANTS';
import { DataPath } from 'types';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  dataPath: DataPath;
  links: ToolLinks;
  isEmbed: boolean;
  analyticsData?: AnalyticsPageData;
};

export const QuestionPage = ({
  storedData,
  data,
  currentStep,
  dataPath,
  links,
  isEmbed,
  analyticsData,
}: Props) => {
  const { z } = useTranslation();
  const { addStepPage } = useAnalytics();

  const qs = getQuestions(z, dataPath);
  const errors = getErrors(z, dataPath);

  if (analyticsData) {
    addStepPage(analyticsData, currentStep);
  }

  return (
    <Questions
      storedData={storedData}
      data={data}
      questions={qs}
      errors={errors}
      currentStep={currentStep}
      backLink={links.question.backLink}
      dataPath={dataPath}
      apiCall={SUBMIT_ANSWER_API}
      isEmbed={isEmbed}
    />
  );
};
