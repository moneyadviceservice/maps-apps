import { SUBMIT_ANSWER_API } from 'CONSTANTS';
import { AnalyticsPageData, useAnalytics } from 'hooks/useAnalytics';
import { DataPath } from 'types';
import { getErrors } from 'utils/getErrors';
import { getQuestions } from 'utils/getQuestions';
import { ToolLinks } from 'utils/getToolLinks';

import { Questions } from '@maps-react/form/components/Questions';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  dataPath: DataPath;
  links: ToolLinks;
  isEmbed: boolean;
  analyticsData?: AnalyticsPageData;
  topInfo?: React.ReactNode;
  bottomInfo?: React.ReactNode;
  alwaysDisplaySubText?: boolean;
};

export const QuestionPage = ({
  storedData,
  data,
  currentStep,
  dataPath,
  links,
  isEmbed,
  analyticsData,
  topInfo,
  bottomInfo,
  alwaysDisplaySubText,
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
      topInfo={topInfo ?? null}
      bottomInfo={bottomInfo ?? null}
      alwaysDisplaySubText={alwaysDisplaySubText}
    />
  );
};
