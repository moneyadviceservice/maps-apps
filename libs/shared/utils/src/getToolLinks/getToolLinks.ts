import { DataFromQuery, PageFilterFunctions } from '../pageFilter';

export type ToolLinks = {
  question: {
    backLink: string;
    goToQuestionOne: string;
    goToQuestionTwo: string;
    goToQuestionThree: string;
    goToQuestionFour?: string;
  };
  change: {
    backLink: string;
    nextLink: string;
  };
  summary: {
    backLink: string;
    nextLink: string;
  };
  result: {
    backLink: string;
    firstStep: string;
  };
};

export const getToolLinks = (
  saveddata: DataFromQuery,
  filter: PageFilterFunctions,
  currentStep: number,
  hasSummary?: boolean,
): ToolLinks => {
  return {
    question: {
      backLink: filter.backStep(currentStep, saveddata),
      goToQuestionOne: filter.goToQuestion(1),
      goToQuestionTwo: filter.goToQuestion(2),
      goToQuestionThree: filter.goToQuestion(3),
      goToQuestionFour: filter.goToQuestion(4),
    },
    change: {
      backLink: filter.goToLastQuestion(saveddata),
      nextLink: hasSummary ? filter.goToSummaryPage() : filter.goToResultPage(),
    },
    summary: {
      backLink: filter.goToChangeOptionsPage(),
      nextLink: filter.goToResultPage(),
    },
    result: {
      backLink: hasSummary
        ? filter.goToSummaryPage()
        : filter.goToChangeOptionsPage(),
      firstStep: filter.goToFirstStep(),
    },
  };
};
