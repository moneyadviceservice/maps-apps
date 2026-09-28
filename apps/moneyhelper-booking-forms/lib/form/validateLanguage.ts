import { z } from 'zod';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../constants';

export interface ValidateLanguageData {
  [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: string;
  [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]?: string;
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
  const accessLanguageType = data[FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE];
  const accessLanguageOther =
    data[FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]?.trim();

  if (accessLanguageType === 'other' && !accessLanguageOther) {
    ctx.addIssue({
      code: 'custom',
      path: [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER],
      message: FORM_FIELD_CONTENT_KEY.accessSupportLanguageOther,
    });
  }
};
