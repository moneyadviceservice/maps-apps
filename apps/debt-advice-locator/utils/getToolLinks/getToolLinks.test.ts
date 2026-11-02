import { getToolLinks, ToolLinks } from './getToolLinks';

const mockFilter = {
  getDataFromQuery: jest.fn(),
  goToStep: jest.fn(),
  backStep: jest.fn().mockReturnValue('/back-link'),
  goToQuestion: jest.fn().mockReturnValue('5'),
};

describe('getToolLinks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct ToolLinks object when hasSummary is true', () => {
    const saveddata = {};
    const currentStep = 1;

    const expectedToolLinks: ToolLinks = {
      question: {
        backLink: '/back-link',
        goToQuestionOne: '5',
        goToQuestionFour: '5',
        goToQuestionTwo: '5',
        goToQuestionThree: '5',
      },
    };

    const result = getToolLinks(saveddata, mockFilter, currentStep);
    expect(result).toEqual(expectedToolLinks);
  });
});
