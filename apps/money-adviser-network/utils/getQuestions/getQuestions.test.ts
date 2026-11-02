import * as questions from '../../data/questions';
import { FLOW, getQuestions } from './getQuestions';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((key) => key),
  }),
}));

jest.mock('../../data/questions', () => ({
  startQuestions: jest.fn(),
  onlineQuestions: jest.fn(),
  telephoneQuestions: jest.fn(),
}));

describe('getQuestions', () => {
  const mockZ = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the result of startQuestions when flow is FLOW.START', () => {
    const startQuestionsResult = ['start-1', 'start-2'];
    (questions.startQuestions as jest.Mock).mockReturnValue(
      startQuestionsResult,
    );

    expect(getQuestions(FLOW.START, mockZ)).toBe(startQuestionsResult);
    expect(questions.startQuestions).toHaveBeenCalledWith(mockZ);
    expect(questions.onlineQuestions).not.toHaveBeenCalled();
    expect(questions.telephoneQuestions).not.toHaveBeenCalled();
  });

  it('should return the result of onlineQuestions when flow is FLOW.ONLINE', () => {
    const onlineQuestionsResult = ['on-1', 'on-2'];
    (questions.onlineQuestions as jest.Mock).mockReturnValue(
      onlineQuestionsResult,
    );

    expect(getQuestions(FLOW.ONLINE, mockZ)).toBe(onlineQuestionsResult);
    expect(questions.onlineQuestions).toHaveBeenCalledWith(mockZ);
    expect(questions.startQuestions).not.toHaveBeenCalled();
    expect(questions.telephoneQuestions).not.toHaveBeenCalled();
  });

  it('should return the result of telephoneQuestions when flow is FLOW.TELEPHONE', () => {
    const telephoneQuestionsResult = ['tel-1', 'tel-2'];
    (questions.telephoneQuestions as jest.Mock).mockReturnValue(
      telephoneQuestionsResult,
    );

    expect(getQuestions(FLOW.TELEPHONE, mockZ)).toBe(telephoneQuestionsResult);
    expect(questions.telephoneQuestions).toHaveBeenCalledWith(mockZ);
    expect(questions.startQuestions).not.toHaveBeenCalled();
    expect(questions.onlineQuestions).not.toHaveBeenCalled();
  });
});
