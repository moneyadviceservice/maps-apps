import { PensionType, getServerSidePropsDefault } from '.';
import { QuestionPage } from 'components/QuestionPage';
import { DataFromQuery } from 'utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';
import { pensionTypeAnalytics as analyticsData } from 'data/form-content/analytics';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';
import { analyticsQuestionPageData } from 'utils/Transformers';
import { useTranslation } from '@maps-digital/shared/hooks';
import { pageTitles } from 'data/pension-type';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  dataPath: DataPath;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({
  storedData,
  data,
  currentStep,
  dataPath,
  links,
  isEmbed,
}: Props) => {
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const { z } = useTranslation();

  const analyticsPageData = analyticsQuestionPageData(
    analyticsData,
    currentStep,
    pageTitles(z),
  );

  return (
    <PensionType step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <QuestionPage
        storedData={storedData}
        data={data}
        currentStep={currentStep}
        dataPath={dataPath}
        links={links}
        analyticsData={analyticsPageData}
        isEmbed={isEmbed}
      />
    </PensionType>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
