import { Questions } from '@maps-react/form/components/Questions';
import {
  AnalyticsPageData,
  useAnalytics,
} from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { midLifeMotErrorMessages } from '../../data/form-content/errors';
import { midLifeMotQuestions } from '../../data/form-content/questions/mid-life-mot';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  dataPath: 'midlife-mot';
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
  const questions = midLifeMotQuestions(z);
  const errors = midLifeMotErrorMessages(z);

  if (analyticsData) {
    addStepPage(analyticsData, currentStep);
  }

  return (
    <Questions
      storedData={storedData}
      data={data}
      questions={questions}
      errors={errors}
      currentStep={currentStep}
      backLink={links.question.backLink}
      dataPath={dataPath}
      apiCall="/api/form-actions/submit-answer"
      isEmbed={isEmbed}
      topInfo={topInfo ?? null}
      bottomInfo={bottomInfo ?? null}
      alwaysDisplaySubText={alwaysDisplaySubText}
    />
  );
};
