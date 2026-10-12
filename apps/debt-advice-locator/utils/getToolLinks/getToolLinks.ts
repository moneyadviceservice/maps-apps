import {
  DataFromQuery,
  PageFilterFunctions,
} from '@maps-react/utils/pageFilter';

export type ToolLinks = {
  question: {
    backLink: string;
    goToQuestionOne: string;
    goToQuestionTwo: string;
    goToQuestionThree: string;
    goToQuestionFour?: string;
  };
};

export const getToolLinks = (
  saveddata: DataFromQuery,
  filter: PageFilterFunctions,
  currentStep: number,
): ToolLinks => {
  return {
    question: {
      backLink: filter.backStep(currentStep, saveddata),
      goToQuestionOne: filter.goToQuestion(1),
      goToQuestionTwo: filter.goToQuestion(2),
      goToQuestionThree: filter.goToQuestion(3),
      goToQuestionFour: filter.goToQuestion(4),
    },
  };
};
