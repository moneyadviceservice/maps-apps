export type FormFieldData = {
  id: string;
  selector: string;
  errorSummaryLinkSuffix?: string;
};

export type ValidationErrorOption = {
  fieldName: string;
  message: string;
  fieldLevelMessage: string;
  fieldGroupName?: string;
};
