import { DataFromQuery, PageFilterFunctions } from '../pageFilter';

export type ToolLinks = {
  question: {
    backLink: string;
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
