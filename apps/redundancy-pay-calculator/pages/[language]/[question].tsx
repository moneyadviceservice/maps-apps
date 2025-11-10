import { Analytics } from '@maps-react/core/components/Analytics';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { Questions } from '@maps-react/form/components/Questions';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import RedundancyPayCalculator, { RedundancyPayCalculatorIndex } from '.';
import { QUESTION_PREFIX, SUBMIT_ANSWER_API } from '../../CONSTANTS';
import { redundancyPayCalculatorAnalytics } from '../../data/form-content/analytics';
import { redundancyPayCalculatorQuestions } from '../../data/form-content/questions';
import {
  getReactComponentType,
  ReactComponentType,
} from '../../utils/getComponentType/getComponentType';
import { getErrors } from '../../utils/getErrors/getErrors';
import { parseStoredData } from '../../utils/parseStoredData';
import { validateAnswers } from '../../utils/validation/validation';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const { addEvent } = useAnalytics();

  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const { z } = useTranslation();
  const qs = redundancyPayCalculatorQuestions(z);
  const lang = useLanguage();

  const enteredValue = storedData[QUESTION_PREFIX + currentStep];

  const inputFieldErrors = validateAnswers(
    currentStep,
    enteredValue,
    storedData,
  );
  const { errors } = getErrors(
    currentStep,
    inputFieldErrors,
    hasError,
    z,
    storedData[2],
  );
  const currentError = errors.find((error) => error.question === currentStep);
  const parsedData = parseStoredData(storedData);
  const analyticsData = redundancyPayCalculatorAnalytics(
    z,
    currentStep as RedundancyPayCalculatorIndex,
    parsedData,
  );

  const topErrorSummary = (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={{ [currentStep]: [currentError?.message] }}
      errorKeyPrefix="q-"
      classNames="mb-8"
    />
  );

  const analyticsError = hasError
    ? {
        reactCompType: getReactComponentType(currentStep - 1),
        reactCompName: qs[currentStep - 1].title,
        errorMessage: `Error: ${currentError?.message}`,
      }
    : undefined;

  const submitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    const question = qs[currentStep - 1];

    const reactCompType = getReactComponentType(currentStep - 1);
    const form = e.target as HTMLFormElement;

    const event = {
      event: 'componentInteraction',
      eventInfo: {
        toolName: analyticsData.tool.toolName,
        toolStep: analyticsData.tool.toolStep,
        stepName: analyticsData.tool.stepName,
        reactCompType: reactCompType,
        reactCompName: question.title,
        fieldValue: getFieldValue(form.elements, reactCompType),
      },
    };

    addEvent(event);
  };

  const linkToLandingPage = `https://www.moneyhelper.org.uk/${lang}/work/losing-your-job/redundancy-pay-calculator`;

  return (
    <RedundancyPayCalculator
      step={currentStep as RedundancyPayCalculatorIndex}
      isEmbed={isEmbed}
    >
      <Analytics
        analyticsData={analyticsData}
        currentStep={currentStep}
        formData={{}}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: false,
          errorMessage: true,
          emptyToolCompletion: false,
        }}
        errors={analyticsError && [analyticsError]}
      >
        <Questions
          displayQuestionNumber={true}
          storedData={storedData}
          data={data}
          questions={qs}
          errors={errors}
          currentStep={currentStep}
          backLink={
            currentStep === 1 ? linkToLandingPage : links.question.backLink
          }
          dataPath={'/'}
          onSubmit={(e) => submitEvent(e)}
          apiCall={SUBMIT_ANSWER_API}
          isEmbed={isEmbed}
          alwaysDisplaySubText={true}
          topInfo={topErrorSummary ?? null}
          inputFieldErrors={inputFieldErrors}
          allowNegative={false}
          layout="grid"
        />
      </Analytics>
    </RedundancyPayCalculator>
  );
};

const getFieldValue = (
  elements: HTMLFormControlsCollection,
  componentType: ReactComponentType,
) => {
  if (ReactComponentType.QuestionRadioButton === componentType)
    return (elements.namedItem('answer') as HTMLInputElement)?.value;
  if (ReactComponentType.QuestionDateDayMonthYear === componentType) {
    return [
      (elements.namedItem('day') as HTMLInputElement)?.value,
      (elements.namedItem('month') as HTMLInputElement)?.value,
      (elements.namedItem('year') as HTMLInputElement)?.value,
    ].join('-');
  }
  if (ReactComponentType.QuestionDateMonthYear === componentType) {
    return [
      (elements.namedItem('month') as HTMLInputElement)?.value,
      (elements.namedItem('year') as HTMLInputElement)?.value,
    ].join('-');
  }
  if (ReactComponentType.QuestionSalary === componentType) {
    const parts = elements.namedItem('answer') as RadioNodeList;
    return [
      (parts[0] as HTMLInputElement).value.replaceAll(',', ''),
      ['yearly', 'monthly', 'weekly'][
        Number((parts[1] as unknown as HTMLSelectElement).value)
      ],
    ].join(' ');
  }
  if (ReactComponentType.QuestionContractualRedundancy === componentType) {
    const parts = elements.namedItem('answer') as RadioNodeList;
    if ((parts[0] as HTMLInputElement).value !== '') {
      return (parts[0] as HTMLInputElement).value.replaceAll(',', '');
    } else {
      return "I don't know";
    }
  }
};

export default Step;

export { getServerSidePropsDefault as getServerSideProps } from '.';
