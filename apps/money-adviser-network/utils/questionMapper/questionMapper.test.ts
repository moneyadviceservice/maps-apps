import { FORM_FIELDS, FORM_GROUPS } from '../../data/questions/types';
import { FLOW } from '../../utils/getQuestions';
import { questionMapper } from './questionMapper';

describe('questionMapper', () => {
  it('returns correct values for FLOW.ONLINE', () => {
    const onlineCases = [
      { questionNumber: 1, expected: FORM_GROUPS.consentOnline },
      { questionNumber: 2, expected: FORM_GROUPS.reference },
      { questionNumber: 3, expected: FORM_GROUPS.customerDetails },
      { questionNumber: 4, expected: 'q-4' },
    ];

    onlineCases.forEach(({ questionNumber, expected }) => {
      expect(questionMapper(questionNumber, FLOW.ONLINE)).toBe(expected);
    });
  });

  it('returns correct values for FLOW.TELEPHONE', () => {
    const telephoneCases = [
      { questionNumber: 1, expected: FORM_FIELDS.consentDetails },
      { questionNumber: 2, expected: FORM_GROUPS.consentReferral },
      { questionNumber: 3, expected: FORM_GROUPS.reference },
      { questionNumber: 4, expected: FORM_GROUPS.whenToSpeak },
      { questionNumber: 5, expected: FORM_GROUPS.timeSlot },
      { questionNumber: 6, expected: FORM_GROUPS.customerDetails },
      { questionNumber: 7, expected: FORM_GROUPS.securityQuestions },
      { questionNumber: 8, expected: 'q-8' },
    ];

    telephoneCases.forEach(({ questionNumber, expected }) => {
      expect(questionMapper(questionNumber, FLOW.TELEPHONE)).toBe(expected);
    });
  });

  it('returns default value for unknown FLOW or unmatched questionNumber', () => {
    expect(questionMapper(2, 'UNKNOWN_FLOW' as FLOW)).toBe('q-2');
    expect(questionMapper(10, FLOW.ONLINE)).toBe('q-10');
  });
});
