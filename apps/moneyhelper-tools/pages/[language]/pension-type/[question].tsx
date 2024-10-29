import {
  PensionType,
  PensionTypeNumberSteps,
  getServerSidePropsDefault,
} from '.';
import { QuestionPage } from 'components/QuestionPage';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { getQuestions } from 'utils/getQuestions';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: PensionTypeNumberSteps;
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

  const { z: enTranslation } = useTranslation('en');
  const questions = getQuestions(enTranslation, dataPath);
  const analyticsError = hasError
    ? {
        reactCompType: 'RadioButton',
        reactCompName: questions[currentStep - 1].title,
        errorMessage: 'Please select an answer',
      }
    : undefined;

  return (
    <PensionType step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <PensionTypeAnalytics
        currentStep={currentStep}
        formData={storedData}
        error={analyticsError}
      >
        <QuestionPage
          storedData={storedData}
          data={data}
          currentStep={currentStep}
          links={links}
          dataPath={dataPath}
          isEmbed={isEmbed}
        />
      </PensionTypeAnalytics>
    </PensionType>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
