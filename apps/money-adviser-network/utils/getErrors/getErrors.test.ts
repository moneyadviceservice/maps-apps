import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FORM_FIELDS } from '../../data/questions/types';
import { FLOW } from '../getQuestions';
import { getErrors } from './getErrors';

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

  it('should return an empty error object when hasError is false', () => {
    const result = getErrors(FLOW.START, { fName: true }, z, 1, false);
    expect(result).toEqual({ errors: [], pageErrors: {} });
  });

  it('should handle FLOW.START with matching currentStep error', () => {
    const result = getErrors(FLOW.START, {}, z, 1, true);
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First question error' },
        { question: 0, message: 'General error' },
      ],
      pageErrors: { 1: ['First question error'] },
    });
  });

  it('should handle FLOW.START with fallback to general error if no currentStep match', () => {
    const result = getErrors(FLOW.START, {}, z, 2, true);
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First question error' },
        { question: 0, message: 'General error' },
      ],
      pageErrors: { 2: ['General error'] },
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
    });
  });

  it('should handle FLOW.ONLINE with generic page errors if hasErrors is empty and hasError is true', () => {
    const result = getErrors(FLOW.ONLINE, {}, z, 0, true);
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First online question error' },
        { question: 0, message: 'General online error' },
      ],
      pageErrors: { 0: ['General online error'] },
    });
  });

  it('should handle FLOW.ONLINE with no errors if hasErrors is empty', () => {
    const result = getErrors(FLOW.ONLINE, {}, z, 0, false);
    expect(result).toEqual({
      errors: [],
      pageErrors: {},
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
    });
  });

  it('should handle FLOW.TELEPHONE with no errors if hasErrors is empty', () => {
    const result = getErrors(FLOW.TELEPHONE, {}, z, 0, false);
    expect(result).toEqual({
      errors: [],
      pageErrors: {},
    });
  });

  it('should handle FLOW.TELEPHONE with generic page errors if hasErrors is empty and hasError is true', () => {
    const result = getErrors(FLOW.TELEPHONE, {}, z, 1, true);
    expect(result).toEqual({
      errors: [
        { question: 1, message: 'First telephone question error' },
        { question: 0, message: 'General telephone error' },
      ],
      pageErrors: { 1: ['First telephone question error'] },
    });
  });
});
