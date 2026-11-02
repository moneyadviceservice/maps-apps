import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { QuestionPage } from 'components/QuestionPage';
import { DataPath } from 'types';
import { QUESTION_PREFIX } from 'utils/constants';
import { getQuestions } from 'utils/getQuestions';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
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

  const { locale } = useTranslation();
  const { z: enTranslation } = useTranslation('en');
  const questions = getQuestions(enTranslation, dataPath);
  const getBackLink = () => {
    const landingPage = isEmbed
      ? `/${locale}/pension-type${addEmbedQuery(isEmbed, '?')}`
      : `https://www.moneyhelper.org.uk/${locale}/pensions-and-retirement/pension-wise/find-out-your-pension-type`;

    return currentStep === 1 ? landingPage : links.question.backLink;
  };

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
          backLink={getBackLink()}
          dataPath={dataPath}
          isEmbed={isEmbed}
        />
      </PensionTypeAnalytics>
    </PensionType>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
