import { pensionTypeText, Section } from './pension-type';

const mockZ = jest.fn(({ en }: { en: string; cy: string }) => en);

describe('pensionTypeText', () => {
  beforeEach(() => {
    mockZ.mockClear();
  });

  it('returns check answers text for Section.CheckAnswers', () => {
    const result = pensionTypeText(mockZ as never, Section.CheckAnswers);
    expect(result).toBe(
      "This is what you've told us. Please make any changes to your answers if you need to.",
    );
  });

  it('returns next page text for Section.ChangeAnswersNextPageText', () => {
    const result = pensionTypeText(
      mockZ as never,
      Section.ChangeAnswersNextPageText,
    );
    expect(result).toBe('Get your action plan');
  });

  it('returns action text for Section.ChangeAnswersPensionTypeAction', () => {
    const result = pensionTypeText(
      mockZ as never,
      Section.ChangeAnswersPensionTypeAction,
    );
    expect(result).toBe('Continue');
  });

  it('returns empty string for unknown section', () => {
    const result = pensionTypeText(mockZ as never, 99 as Section);
    expect(result).toBe('');
  });
});
