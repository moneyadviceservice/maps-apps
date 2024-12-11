import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { QuestionPage } from 'components/QuestionPage';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';
import { getQuestions } from 'utils/getQuestions';
import { ToolLinks } from 'utils/getToolLinks';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import {
  getServerSidePropsDefault,
  PensionType,
  PensionTypeNumberSteps,
} from '.';

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
