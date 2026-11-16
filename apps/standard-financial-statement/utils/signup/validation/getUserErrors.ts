import { QuestionOrg } from 'data/form-data/org_signup';
import { ZodError } from 'zod';

export const getUserErrors = (
  inputs: QuestionOrg[] | null[],
  error: ZodError,
) => {
  return error.issues.reduce((acc, issue) => {
    const fieldName = issue.path[0] as string;
    const isEmail =
      fieldName === 'emailAddress' &&
      (issue.message === 'not_allowed' ||
        issue.message === 'user_already_exists');
    const type = isEmail ? issue.message : issue.code;
    if (!acc[fieldName]) {
      const field = inputs.find((item) => item?.name === fieldName);
      const fieldType = field?.errors?.[type];
      if (!field) {
        // Fallback if errors return not related to the supplied inputs
        acc[fieldName] = [`${fieldName} - ${issue.message}`];
      } else {
        acc[fieldName] = [`${field?.title} - ${fieldType ?? issue.message}`];
      }
    }
    return acc;
  }, {} as Record<string, string[]>);
};
