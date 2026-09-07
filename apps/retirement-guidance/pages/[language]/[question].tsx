import { retirementGuidanceQuestions } from 'data/questions';
import {
  PAGE_NAME_PREFIX,
  PAGE_TITLE_PREFIX,
  QUESTION_PREFIX,
  TOOL_NAME,
} from 'lib/constants';
import { getError } from 'lib/error';
import { RetirementGuidanceIndex } from 'lib/types';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Questions } from '@maps-react/form/components/Questions';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { RetirementGuidance } from '.';
import { useRetirementGuidanceAnalytics } from '../../lib/hooks';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const { t, locale } = useTranslation();
  const hasError = storedData?.error === `${QUESTION_PREFIX}${currentStep}`;

  const questions = retirementGuidanceQuestions(t);
  const currentQuestion = questions.find(
    (question) => question.questionNbr === currentStep,
  );
  const currentQuestionType = currentQuestion?.type;

  // Get the question-specific error description, with a generic fallback
  const errorSummaryDescription = t(
    `q${currentStep}.errorSummaryDescription`,
    undefined,
    t('errorSummaryDescription'),
  );

  useRetirementGuidanceAnalytics({
    pageName: `${PAGE_NAME_PREFIX}question-${currentStep}`,
    pageTitle: `${PAGE_TITLE_PREFIX}Question ${currentStep}`,
    toolStep: `${currentStep + 1}`,
    stepName: `Question ${currentStep}`,
    fireToolStart: false,
    hasError,
    errorMessage: errorSummaryDescription,
  });

  /**
   * @note: This currently only works for radio and checkbox questions, as those
   * are the only types in use (as of July 2026). The logic is tightly linked to
   * the shared <Questions> component, so will be fragile in case of that
   * component being changed in future.
   */
  const errorKey = currentQuestionType === 'multiple' ? 'option-0' : 'id-0';

  const topErrorSummary = (
    <ErrorSummary
      title={t('errorSummaryHeading')}
      errors={{
        [errorKey]: [errorSummaryDescription],
      }}
      classNames="mb-8"
    />
  );

  const errors = getError(currentStep, hasError);
  const currentError = errors.errors.find(
    (error) => error.question === currentStep,
  );

  const getBackLink = () => {
    const landingPage = isEmbed
      ? `/${locale}/landing`
      : `https://www.moneyhelper.org.uk/${locale}/pensions-and-retirement/pensions-basics/get-retirement-guidance`;

    return currentStep === 1 ? landingPage : links.question.backLink;
  };

  return (
    <RetirementGuidance
      step={currentStep as RetirementGuidanceIndex}
      isEmbed={isEmbed}
    >
      <Questions
        storedData={storedData}
        data={data}
        questions={questions}
        errors={currentError ? [currentError] : []}
        currentStep={currentStep}
        backLink={getBackLink()}
        dataPath={'/'}
        apiCall={'/api/submit-answer'}
        isEmbed={isEmbed}
        topInfo={hasError ? topErrorSummary : null}
        layout="grid"
        toolName={TOOL_NAME}
      />
    </RetirementGuidance>
  );
};

export default Step;

export { getServerSidePropsDefault as getServerSideProps } from '.';
