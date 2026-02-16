import * as questions from '../../data/questions';
import { FLOW, getQuestions } from '../getQuestions';

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

  const testFlow = (
    flow: FLOW,
    mockFunction: jest.Mock,
    mockResult: string[],
    notCalledFunctions: jest.Mock[],
  ) => {
    mockFunction.mockReturnValue(mockResult);

    expect(getQuestions(flow, mockZ)).toBe(mockResult);
    expect(mockFunction).toHaveBeenCalledWith(mockZ);
    notCalledFunctions.forEach((fn) => expect(fn).not.toHaveBeenCalled());
  };

  it('should return the result of startQuestions when flow is FLOW.START', () => {
    testFlow(
      FLOW.START,
      questions.startQuestions as jest.Mock,
      ['start-1', 'start-2'],
      [
        questions.onlineQuestions as jest.Mock,
        questions.telephoneQuestions as jest.Mock,
      ],
    );
  });

  it('should return the result of onlineQuestions when flow is FLOW.ONLINE', () => {
    testFlow(
      FLOW.ONLINE,
      questions.onlineQuestions as jest.Mock,
      ['on-1', 'on-2'],
      [
        questions.startQuestions as jest.Mock,
        questions.telephoneQuestions as jest.Mock,
      ],
    );
  });

  it('should return the result of telephoneQuestions when flow is FLOW.TELEPHONE', () => {
    testFlow(
      FLOW.TELEPHONE,
      questions.telephoneQuestions as jest.Mock,
      ['tel-1', 'tel-2'],
      [
        questions.startQuestions as jest.Mock,
        questions.onlineQuestions as jest.Mock,
      ],
    );
  });
});
