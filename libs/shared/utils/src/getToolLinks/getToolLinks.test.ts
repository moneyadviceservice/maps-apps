import { DataFromQuery, PageFilterFunctions } from '../pageFilter';
import { getToolLinks, ToolLinks } from './getToolLinks';

const mockFilter: PageFilterFunctions = {
  getDataFromQuery: jest.fn(),
  convertQueryParamsToString: jest.fn(),
  goToStep: jest.fn(),
  backStep: jest.fn().mockReturnValue('/back-link'),
  goToLastQuestion: jest.fn().mockReturnValue('/last-question-link'),
  goToSummaryPage: jest.fn().mockReturnValue('/summary-link'),
  goToResultPage: jest.fn().mockReturnValue('/result-link'),
  goToChangeOptionsPage: jest.fn().mockReturnValue('/change-options-link'),
  goToFirstStep: jest.fn().mockReturnValue('/first-step-link'),
  goToQuestion: jest.fn().mockReturnValue('5'),
};

describe('getToolLinks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct ToolLinks object when hasSummary is true', () => {
    const saveddata: DataFromQuery = {};
    const currentStep = 1;
    const hasSummary = true;

    const expectedToolLinks: ToolLinks = {
      question: {
        backLink: '/back-link',
        goToQuestionOne: '5',
        goToQuestionTwo: '5',
        goToQuestionThree: '5',
        goToQuestionFour: '5',
      },
      change: { backLink: '/last-question-link', nextLink: '/summary-link' },
      summary: { backLink: '/change-options-link', nextLink: '/result-link' },
      result: { backLink: '/summary-link', firstStep: '/first-step-link' },
    };

    const result = getToolLinks(saveddata, mockFilter, currentStep, hasSummary);
    expect(result).toEqual(expectedToolLinks);

    expect(mockFilter.backStep).toHaveBeenCalledWith(currentStep, saveddata);
    expect(mockFilter.goToLastQuestion).toHaveBeenCalledWith(saveddata);
    expect(mockFilter.goToSummaryPage).toHaveBeenCalled();
    expect(mockFilter.goToResultPage).toHaveBeenCalled();
    expect(mockFilter.goToChangeOptionsPage).toHaveBeenCalled();
    expect(mockFilter.goToFirstStep).toHaveBeenCalled();
  });

  it('returns correct ToolLinks object when hasSummary is false', () => {
    const saveddata: DataFromQuery = {};
    const currentStep = 1;
    const hasSummary = false;

    const expectedToolLinks: ToolLinks = {
      question: {
        backLink: '/back-link',
        goToQuestionOne: '5',
        goToQuestionTwo: '5',
        goToQuestionThree: '5',
        goToQuestionFour: '5',
      },
      change: { backLink: '/last-question-link', nextLink: '/result-link' },
      summary: { backLink: '/change-options-link', nextLink: '/result-link' },
      result: {
        backLink: '/change-options-link',
        firstStep: '/first-step-link',
      },
    };

    const result = getToolLinks(saveddata, mockFilter, currentStep, hasSummary);
    expect(result).toEqual(expectedToolLinks);

    expect(mockFilter.backStep).toHaveBeenCalledWith(currentStep, saveddata);
    expect(mockFilter.goToLastQuestion).toHaveBeenCalledWith(saveddata);
    expect(mockFilter.goToSummaryPage).not.toHaveBeenCalled();
    expect(mockFilter.goToResultPage).toHaveBeenCalled();
    expect(mockFilter.goToChangeOptionsPage).toHaveBeenCalled();
    expect(mockFilter.goToFirstStep).toHaveBeenCalled();
  });
});
