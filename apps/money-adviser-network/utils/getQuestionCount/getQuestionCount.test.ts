import { FLOW, getQuestions } from 'utils/getQuestions';

import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { getQuestionCount } from './getQuestionCount';

jest.mock('utils/getQuestions', () => ({
  getQuestions: jest.fn(),
  FLOW: {
    START: 'start',
    ONLINE: 'online',
    TELEPHONE: 'telephone',
  },
}));

jest.mock('@maps-react/hooks/useTranslation');

describe('getQuestionCount', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTranslationFunction = jest.fn((translations) => {
    return translations.en;
  });

  const mockedGetQuestions = getQuestions as jest.MockedFunction<
    typeof getQuestions
  >;

  const mockQuestion = {} as Question;

  it('returns the correct number of questions', () => {
    mockedGetQuestions.mockReturnValueOnce([
      mockQuestion,
      mockQuestion,
      mockQuestion,
    ]);

    const count = getQuestionCount(FLOW.START, mockTranslationFunction);

    expect(getQuestions).toHaveBeenCalledWith(
      FLOW.START,
      mockTranslationFunction,
    );
    expect(count).toBe(3);
  });

  it('returns zero when there are no questions', () => {
    mockedGetQuestions.mockReturnValueOnce([]);

    const count = getQuestionCount(FLOW.ONLINE, mockTranslationFunction);

    expect(getQuestions).toHaveBeenCalledWith(
      FLOW.ONLINE,
      mockTranslationFunction,
    );
    expect(count).toBe(0);
  });

  it('handles different flows correctly', () => {
    mockedGetQuestions.mockReturnValueOnce([mockQuestion]);

    const count = getQuestionCount(FLOW.TELEPHONE, mockTranslationFunction);

    expect(getQuestions).toHaveBeenCalledWith(
      FLOW.TELEPHONE,
      mockTranslationFunction,
    );
    expect(count).toBe(1);
  });
});
