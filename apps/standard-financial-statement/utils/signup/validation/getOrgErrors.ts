import { QuestionOrg } from 'data/form-data/org_signup';

import { ErrorField } from '@maps-react/form/types';

export const getOrgErrors = (inputs: QuestionOrg[], errors: ErrorField[]) => {
  return errors.reduce((acc, issue) => {
    const fieldName = issue.field;
    const type = issue.type;
    if (!acc[fieldName]) {
      const field = inputs.find(
        (item) => item?.name === fieldName || fieldName === `${item.name}Other`,
      );
      acc[fieldName] = [`${field?.title} - ${field?.errors?.[type]}`];
    }
    return acc;
  }, {} as Record<string, string[]>);
};
