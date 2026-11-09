import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FORM_FIELDS } from '../../data/questions/types';
import { FLOW } from '../getQuestions';
import { getErrorKey, getErrors } from './getErrors';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key),
  })),
}));

jest.mock('../../data/errors', () => ({
  onlineGenErrorMessages: jest.fn(() => [
    { question: 1, message: 'First online question error' },
    { question: 0, message: 'General online error' },
  ]),
  errorMessages: jest.fn(() => [
    { question: 1, message: 'First question error' },
    { question: 0, message: 'General error' },
  ]),
  fieldErrorMessages: jest.fn((z) => ({
    firstName: 'Error for firstName',
    email: 'Error for email',
    telephone: 'Error for telephone',
    default: 'Default error message',
  })),
  telephoneGenErrorMessages: jest.fn(() => [
    { question: 1, message: 'First telephone question error' },
    { question: 0, message: 'General telephone error' },
  ]),
}));

describe('getErrors', () => {
  const { z } = useTranslation();
  const mockQuestion = {
    questionNbr: 1,
    group: '',
    title: z({
      en: 'What does the customer need?',
      cy: 'Beth sydd ei angen ar y cwsmer?',
    }),
    type: 'single',
    subType: '',
    isRadio: true,
    classes: ['test-class'],
    answers: [
      {
        text: z({ en: 'Money management help', cy: 'Help rheoli arian' }),
        subtext: z({
          en: 'Help with day-to-day money management through online tools and guidance.',
          cy: 'Help gyda rheoli arian o ddydd i ddydd drwy declynnau ac arweiniad ar-lein.',
        }),
      },
      {
        text: z({ en: 'Debt advice', cy: 'Cyngor ar ddyledion' }),
        subtext: z({
          en: 'Get personalised help on how to manage debt.',
          cy: 'Cael help personol ar sut i reoli dyled.',
        }),
      },
    ],
  };

  it('should return an empty error object when hasError is false', () => {
    const result = getErrors(FLOW.START, { fName: true }, z, 1, false);
    expect(result).toEqual({ errors: [], pageErrors: {}, acdlErrors: [] });
  });

  it('should handle FLOW.START with matching currentStep error', () => {
    const result = getErrors(FLOW.START, {}, z, 1, true, {
      ...mockQuestion,
      title: 'Question title',
    });
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First question error' },
        { question: 0, message: 'General error' },
      ],
      pageErrors: { 'id-0': ['First question error'] },
      acdlErrors: [
        {
          fieldName: 'Question title',
          fieldType: 'Radio button',
          errorMessage: 'First question error',
        },
      ],
    });
  });

  it('should handle FLOW.START with fallback to general error if no currentStep match', () => {
    const result = getErrors(FLOW.START, {}, z, 2, true, {
      ...mockQuestion,
      title: 'Question title',
    });
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First question error' },
        { question: 0, message: 'General error' },
      ],
      pageErrors: { 'id-0': ['General error'] },
      acdlErrors: [
        {
          fieldName: 'Question title',
          fieldType: 'Radio button',
          errorMessage: 'General error',
        },
      ],
    });
  });

  it('should handle FLOW.ONLINE with specific field errors', () => {
    const result = getErrors(
      FLOW.ONLINE,
      { [FORM_FIELDS.firstName]: true, [FORM_FIELDS.email]: true },
      z,
      0,
      true,
    );
    expect(result).toEqual({
      errors: [
        { question: FORM_FIELDS.firstName, message: 'Error for firstName' },
        { question: FORM_FIELDS.email, message: 'Error for email' },
      ],
      pageErrors: {
        [FORM_FIELDS.firstName]: ['Error for firstName'],
        [FORM_FIELDS.email]: ['Error for email'],
      },
      acdlErrors: [
        {
          fieldName: FORM_FIELDS.firstName,
          fieldType: 'Text field',
          errorMessage: 'Error for firstName',
        },
        {
          fieldName: FORM_FIELDS.email,
          fieldType: 'Email field',
          errorMessage: 'Error for email',
        },
      ],
    });
  });

  it('should handle FLOW.ONLINE with generic page errors if hasErrors is empty and hasError is true', () => {
    const result = getErrors(FLOW.ONLINE, {}, z, 0, true, {
      ...mockQuestion,
      title: 'Question title',
    });
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First online question error' },
        { question: 0, message: 'General online error' },
      ],
      pageErrors: { 'id-0': ['General online error'] },
      acdlErrors: [
        {
          fieldName: 'Question title',
          fieldType: 'Radio button',
          errorMessage: 'General online error',
        },
      ],
    });
  });

  it('should handle FLOW.ONLINE with no errors if hasErrors is empty', () => {
    const result = getErrors(FLOW.ONLINE, {}, z, 0, false);
    expect(result).toEqual({
      errors: [],
      pageErrors: {},
      acdlErrors: [],
    });
  });

  it('should handle FLOW.TELEPHONE with specific field errors', () => {
    const result = getErrors(
      FLOW.TELEPHONE,
      { [FORM_FIELDS.firstName]: true, [FORM_FIELDS.telephone]: true },
      z,
      0,
      true,
    );
    expect(result).toEqual({
      errors: [
        { question: FORM_FIELDS.firstName, message: 'Error for firstName' },
        { question: FORM_FIELDS.telephone, message: 'Error for telephone' },
      ],
      pageErrors: {
        [FORM_FIELDS.firstName]: ['Error for firstName'],
        [FORM_FIELDS.telephone]: ['Error for telephone'],
      },
      acdlErrors: [
        {
          fieldName: FORM_FIELDS.firstName,
          fieldType: 'Text field',
          errorMessage: 'Error for firstName',
        },
        {
          fieldName: FORM_FIELDS.telephone,
          fieldType: 'Telephone field',
          errorMessage: 'Error for telephone',
        },
      ],
    });
  });

  it('should handle FLOW.TELEPHONE with no errors if hasErrors is empty', () => {
    const result = getErrors(FLOW.TELEPHONE, {}, z, 0, false);
    expect(result).toEqual({
      errors: [],
      pageErrors: {},
      acdlErrors: [],
    });
  });

  it('should handle FLOW.TELEPHONE with generic page errors if hasErrors is empty and hasError is true', () => {
    const result = getErrors(FLOW.TELEPHONE, {}, z, 1, true, {
      ...mockQuestion,
      title: 'Question title',
    });
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First telephone question error' },
        { question: 0, message: 'General telephone error' },
      ],
      pageErrors: { 'id-0': ['First telephone question error'] },
      acdlErrors: [
        {
          fieldName: 'Question title',
          fieldType: 'Radio button',
          errorMessage: 'First telephone question error',
        },
      ],
    });
  });

  describe('getErrorKey', () => {
    const testDefaultKey = 'test-default-key';

    it('returns defaultKey when question is a non-radio type', () => {
      const { isRadio, ...mockNonRadioQuestion } = mockQuestion;

      expect(getErrorKey(mockNonRadioQuestion, testDefaultKey)).toBe(
        testDefaultKey,
      );
    });

    it('returns expected key pointing to fieldset/group when question is a radio type and all answers are disabled', () => {
      const mockRadioQuestionAllAnswersDisabled = {
        ...mockQuestion,
        answers: [
          ...mockQuestion.answers.map((answer) => ({
            ...answer,
            disabled: true,
          })),
        ],
      };

      expect(
        getErrorKey(mockRadioQuestionAllAnswersDisabled, testDefaultKey),
      ).toBe(`${testDefaultKey}-group`);
    });

    it('returns expected key pointing to first non-disabled radio input when question is a radio type and at least one answer is not disabled', () => {
      const mockRadioQuestionAllAnswersDisabled = {
        ...mockQuestion,
        answers: [
          { ...mockQuestion.answers[0], disabled: true },
          { ...mockQuestion.answers[1] },
        ],
      };

      expect(
        getErrorKey(mockRadioQuestionAllAnswersDisabled, testDefaultKey),
      ).toBe('id-1');
    });
  });
});
