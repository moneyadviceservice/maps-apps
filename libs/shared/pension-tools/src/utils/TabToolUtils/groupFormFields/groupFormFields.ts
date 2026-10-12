import { FormField } from '../../../types/forms';

export type GroupedFields = {
  [key: string]: FormField[];
};

export const groupFormFields = (formFields: FormField[]) => {
  const groupedFields = formFields.reduce((acc, field) => {
    const groupName = field.group?.key;
    if (groupName) {
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(field);
    } else {
      acc['no-group'] = acc['no-group'] || [];
      acc['no-group'].push(field);
    }
    return acc;
  }, {} as GroupedFields);

  return groupedFields;
};
