import { z } from 'zod';

export interface ValidateLanguageData {
  accessLanguageType: string;
  accessLanguageOther?: string;
}
/**
 * Custom validation function to ensure that if 'other' is selected as the access language, a value must be provided in the accompanying text field, and if 'other' is not selected, the accompanying text field must be empty.
 * @param data
 * @param ctx
 */
export const validateLanguage = (
  data: ValidateLanguageData,
  ctx: z.RefinementCtx,
) => {
  const accessLanguageType = data.accessLanguageType;
  const accessLanguageOther = data.accessLanguageOther?.trim();

  if (accessLanguageType === 'other' && !accessLanguageOther) {
    ctx.addIssue({
      code: 'custom',
      path: ['accessLanguageOther'],
      message: 'language-other',
    });
  }

  if (accessLanguageType !== 'other' && accessLanguageOther) {
    ctx.addIssue({
      code: 'custom',
      path: ['accessLanguageOther'],
      message: 'language-other',
    });
  }
};
