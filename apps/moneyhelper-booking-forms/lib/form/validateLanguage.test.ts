import { z } from 'zod';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../constants';
import { validateLanguage } from './validateLanguage';

describe('validateLanguage', () => {
  const refinementCtxMock = {
    addIssue: jest.fn(),
  };

  beforeEach(() => {
    refinementCtxMock.addIssue.mockClear();
  });

  it('adds an error when other is selected but no value is provided in the text field', () => {
    const invalidData = {
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'other',
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: '',
    };

    validateLanguage(
      invalidData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).toHaveBeenCalledWith({
      code: 'custom',
      path: [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER],
      message: FORM_FIELD_CONTENT_KEY.accessSupportLanguageOther,
    });
  });

  it('passes when other is selected and a value is provided', () => {
    const validData = {
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'other',
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: 'British Sign Language',
    };

    validateLanguage(
      validData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).not.toHaveBeenCalled();
  });

  it('passes when a language is selected that is not other', () => {
    const validData = {
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'english',
    };
    validateLanguage(
      validData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).not.toHaveBeenCalled();
  });
});
