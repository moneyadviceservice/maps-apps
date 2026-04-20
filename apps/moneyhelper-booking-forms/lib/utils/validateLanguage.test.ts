import { z } from 'zod';

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
      accessLanguageType: 'other',
      accessLanguageOther: '',
    };

    validateLanguage(
      invalidData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).toHaveBeenCalledWith({
      code: 'custom',
      path: ['accessLanguageOther'],
      message: 'language-other',
    });
  });

  it('passes when other is selected and a value is provided', () => {
    const validData = {
      accessLanguageType: 'other',
      accessLanguageOther: 'British Sign Language',
    };

    validateLanguage(
      validData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).not.toHaveBeenCalled();
  });

  it('passes when a language is selected that is not other', () => {
    const validData = {
      accessLanguageType: 'english',
    };
    validateLanguage(
      validData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).not.toHaveBeenCalled();
  });

  it('adds an error when a non-other language is selected and other language still contains content', () => {
    const invalidData = {
      accessLanguageType: 'english',
      accessLanguageOther: 'Arabic',
    };

    validateLanguage(
      invalidData,
      refinementCtxMock as unknown as z.RefinementCtx,
    );

    expect(refinementCtxMock.addIssue).toHaveBeenCalledWith({
      code: 'custom',
      path: ['accessLanguageOther'],
      message: 'language-other',
    });
  });
});
