import { QuestionPage } from 'components/QuestionPage';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { questionHelp } from 'data/form-content/text/debt-advice-locator';
import { DataPath } from 'types';
import { getErrors } from 'utils/getErrors';
import { ToolLinks } from 'utils/getToolLinks';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import useTranslation from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import DebtAdviceLocator, { getServerSidePropsDefault } from '.';

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
  const errors = getErrors(z, dataPath);
  const currentError = errors.find((error) => error.question === currentStep);
  const helpSection = questionHelp(z)[currentStep];

  return (
    <DebtAdviceLocator step={currentStep} isEmbed={isEmbed}>
      <QuestionPage
        storedData={storedData}
        data={data}
        currentStep={currentStep}
        links={links}
        dataPath={dataPath}
        isEmbed={isEmbed}
        alwaysDisplaySubText={true}
        topInfo={
          <ErrorSummary
            title={z({
              en: 'There is a problem',
              cy: 'Mae yna broblem',
            })}
            errors={
              hasError && currentError
                ? { [currentStep]: [currentError.message] }
                : {}
            }
            errorKeyPrefix={'q-'}
            classNames="mb-8"
          />
        }
        bottomInfo={
          helpSection ? <div className="mt-6">{helpSection}</div> : null
        }
      />
    </DebtAdviceLocator>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
