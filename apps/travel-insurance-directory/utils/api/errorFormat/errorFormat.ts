import { ApiFormValidationState, FieldResult } from 'types/register';

export const errorFormat = (
  fields: Record<string, FieldResult>,
): ApiFormValidationState & { error: boolean } => {
  return {
    ok: false,
    fields,
    error: true,
  };
};
