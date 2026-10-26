import { FLOW } from '../../utils/getQuestions';
import { DataFromQuery, PageFilterFunctions } from '../../utils/pageFilter';
import { generateToolLinks, ToolLinks } from './generateToolLinks';

const questionPassedIn = '2';

const mockFilter: PageFilterFunctions = {
  getDataFromQuery: jest.fn(),
  convertQueryParamsToString: jest.fn(),
  goToStep: jest.fn(),
  backStep: jest.fn().mockReturnValue('/back-link'),
  goToLastQuestion: jest.fn().mockReturnValue('/last-question-link'),
  goToResultPage: jest.fn().mockReturnValue('/result-link'),
  goToChangeOptionsPage: jest.fn().mockReturnValue('/change-options-link'),
  goToFirstStep: jest.fn().mockReturnValue('/first-step-link'),
  goToQuestion: jest.fn().mockReturnValue(questionPassedIn),
};

describe('generateToolLinks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct ToolLinks object', () => {
    const saveddata: DataFromQuery = {};
    const cookieData: DataFromQuery = {};
    const currentStep = 2;

    const expectedToolLinks: ToolLinks = {
      question: {
        backLink: '/back-link',
        goToQuestionOne: questionPassedIn,
        goToQuestionTwo: questionPassedIn,
        goToQuestionThree: questionPassedIn,
      },
      change: { backLink: '/last-question-link', nextLink: '/result-link' },
      confirmation: {
        backLink: '/change-options-link',
        start: '/first-step-link',
      },
    };

    const result = generateToolLinks(
      saveddata,
      cookieData,
      mockFilter,
      currentStep,
      FLOW.START,
      '',
    );

    expect(result).toEqual(expectedToolLinks);

    expect(mockFilter.backStep).toHaveBeenCalledWith(
      currentStep,
      saveddata,
      cookieData,
      FLOW.START,
      '',
    );
    expect(mockFilter.goToLastQuestion).toHaveBeenCalledWith(
      saveddata,
      'start',
    );
    expect(mockFilter.goToResultPage).toHaveBeenCalled();
    expect(mockFilter.goToChangeOptionsPage).toHaveBeenCalled();
    expect(mockFilter.goToFirstStep).toHaveBeenCalled();
  });
});
