import { retirementGuidanceErrorMessages } from './errors';

const mockTranslations: Record<string, string> = {
  errorSummaryDescription: 'Please select an answer',
  'q1.errorSummaryDescription': 'Select one option to continue.',
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string, data?: Record<string, string>, fallback = key) => {
      const translations = data ?? mockTranslations;
      return translations[key] || fallback;
    },
  })),
}));

describe('retirementGuidanceErrorMessages', () => {
  it('returns question-specific error message', () => {
    expect(retirementGuidanceErrorMessages(1)).toEqual([
      {
        question: 1,
        message: 'Select one option to continue.',
      },
    ]);
  });

  it(`returns generic fallback error when question-specific error doesn't exist`, () => {
    expect(retirementGuidanceErrorMessages(999)).toEqual([
      {
        question: 999,
        message: 'Please select an answer',
      },
    ]);
  });
});
