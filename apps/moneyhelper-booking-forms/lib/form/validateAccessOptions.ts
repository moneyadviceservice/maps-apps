import { z } from 'zod';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../constants';

export const NONE_OF_THE_ABOVE_OPTION = 'none';

export interface ValidateAccessOptionsData {
  [FormFieldName.ACCESS_SUPPORT_REQUEST]: string;
  [FormFieldName.ACCESS_SUPPORT_COMPANION]?: string;
  [FormFieldName.ACCESS_SUPPORT_DETAILS]?: string;
}

export const validateAccessOptions = (
  data: ValidateAccessOptionsData,
  ctx: z.RefinementCtx,
) => {
  const isNoneOfTheAbove: boolean =
    data[FormFieldName.ACCESS_SUPPORT_REQUEST] === NONE_OF_THE_ABOVE_OPTION;

  const hasCompanion = Boolean(data[FormFieldName.ACCESS_SUPPORT_COMPANION]);
  const hasAdditionalDetails = Boolean(
    data[FormFieldName.ACCESS_SUPPORT_DETAILS]?.trim(),
  );

  if (isNoneOfTheAbove && !hasCompanion && !hasAdditionalDetails) {
    ctx.addIssue({
      code: 'custom',
      path: [FormFieldName.ACCESS_SUPPORT_COMPANION],
      message: FORM_FIELD_CONTENT_KEY.accessSupportCompanion,
    });
    ctx.addIssue({
      code: 'custom',
      path: [FormFieldName.ACCESS_SUPPORT_DETAILS],
      message: FORM_FIELD_CONTENT_KEY.accessSupportDetails,
    });
  }
};
