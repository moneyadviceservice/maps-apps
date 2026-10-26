import { z } from 'zod';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../constants';
import {
  NONE_OF_THE_ABOVE_OPTION,
  validateAccessOptions,
} from './validateAccessOptions';

const schema = z
  .object({
    [FormFieldName.ACCESS_SUPPORT_REQUEST]: z.string(),
    [FormFieldName.ACCESS_SUPPORT_COMPANION]: z.string().optional(),
    [FormFieldName.ACCESS_SUPPORT_DETAILS]: z.string().optional(),
  })
  .superRefine(validateAccessOptions);

describe('validateAccessOptions', () => {
  it('requires a companion or additional details when none of the above is selected', () => {
    const result = schema.safeParse({
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: NONE_OF_THE_ABOVE_OPTION,
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: '',
      [FormFieldName.ACCESS_SUPPORT_DETAILS]: '   ',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: [FormFieldName.ACCESS_SUPPORT_COMPANION],
          message: FORM_FIELD_CONTENT_KEY.accessSupportCompanion,
        }),
        expect.objectContaining({
          path: [FormFieldName.ACCESS_SUPPORT_DETAILS],
          message: FORM_FIELD_CONTENT_KEY.accessSupportDetails,
        }),
      ]);
    }
  });

  it.each([
    {
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: NONE_OF_THE_ABOVE_OPTION,
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: 'someone-to-attend-appointment',
      [FormFieldName.ACCESS_SUPPORT_DETAILS]: '',
    },
    {
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: NONE_OF_THE_ABOVE_OPTION,
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: '',
      [FormFieldName.ACCESS_SUPPORT_DETAILS]:
        'Please explain information slowly.',
    },
    {
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'bsl-interpreter|access-bsl',
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: '',
      [FormFieldName.ACCESS_SUPPORT_DETAILS]: '',
    },
  ])('accepts a valid access-options submission', (data) => {
    expect(schema.safeParse(data).success).toBe(true);
  });
});
