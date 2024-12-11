import { FLOW } from '../../utils/getQuestions';
import { DataFromQuery, PageFilterFunctions } from '../../utils/pageFilter';

export type ToolLinks = {
  question: {
    backLink: string;
    goToQuestionOne: string;
    goToQuestionTwo: string;
    goToQuestionThree: string;
  };
  change: {
    backLink: string;
    nextLink: string;
  };
  confirmation: {
    backLink: string;
    start: string;
  };
};

export const generateToolLinks = (
  saveddata: DataFromQuery,
  cookieData: DataFromQuery,
  filter: PageFilterFunctions,
  currentStep: number,
  currentFlow: FLOW,
  url: string | undefined,
): ToolLinks => {
  const checkFlow = () => {
    return currentFlow !== FLOW.START
      ? filter.backStep(currentStep, saveddata, cookieData, currentFlow, url)
      : '';
  };
  return {
    question: {
      backLink:
        currentStep > 1
          ? filter.backStep(
              currentStep,
              saveddata,
              cookieData,
              currentFlow,
              url,
            )
          : checkFlow(),
      goToQuestionOne: filter.goToQuestion(1),
      goToQuestionTwo: filter.goToQuestion(2),
      goToQuestionThree: filter.goToQuestion(3),
    },
    change: {
      backLink: filter.goToLastQuestion(saveddata, currentFlow),
      nextLink: filter.goToResultPage(),
    },
    confirmation: {
      backLink: filter.goToChangeOptionsPage(),
      start: filter.goToFirstStep(),
    },
  };
};
