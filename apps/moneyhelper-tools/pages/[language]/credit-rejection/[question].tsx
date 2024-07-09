import { CreditRejection, getServerSidePropsDefault } from '.';
import { QuestionPage } from 'components/QuestionPage';
import { DataFromQuery } from 'utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';
import { creditRejectionAnalytics as analyticsData } from 'data/form-content/analytics';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';

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

  return (
    <CreditRejection step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <QuestionPage
        storedData={storedData}
        data={data}
        currentStep={currentStep}
        dataPath={dataPath}
        links={links}
        analyticsData={analyticsData}
        isEmbed={isEmbed}
      />
    </CreditRejection>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
