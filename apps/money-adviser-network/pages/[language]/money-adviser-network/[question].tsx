import { MoneyAdviserNetwork, getServerSidePropsDefault } from '.';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { ToolLinks } from 'utils/generateToolLinks';
import { QUESTION_PREFIX, TOOL_PATH } from 'CONSTANTS';
import { questions } from 'data/questions/questions';
import { errorMessages } from 'data/errors';
import useTranslation from '@maps-react/hooks/useTranslation';
import { QuestionPage } from 'components/QuestionPage';
import { questionHelp } from 'data/question-help';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const { z } = useTranslation();

  const qs = questions(z);
  const errors = errorMessages(z);
  const helpSection = questionHelp(z)[currentStep];

  const errorObject =
    errors.find((error) => error.question === currentStep) ||
    errors.find((error) => error.question === 0);

  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const pageErrors =
    hasError && errorObject?.message
      ? { [currentStep]: [errorObject.message] }
      : {};

  const ErrorSection = pageErrors && (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={pageErrors}
      errorKeyPrefix={'q-'}
    />
  );

  return (
    <MoneyAdviserNetwork
      step={hasError ? 'error' : currentStep}
      isEmbed={isEmbed}
    >
      <QuestionPage
        storedData={storedData}
        data={data}
        questions={qs}
        errors={errors}
        currentStep={currentStep}
        links={links}
        toolPath={TOOL_PATH}
        isEmbed={isEmbed}
        helpSection={helpSection}
        pageError={ErrorSection}
      />
    </MoneyAdviserNetwork>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
