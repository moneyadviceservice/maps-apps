export type CreateUserObject = {
  givenName?: string;
  surname?: string;
  individualReferenceNumber?: string;
  jobTitle?: string;
  mail?: string;
  phone?: string;
  confirmation?: string;
};

export type FcaObject = {
  firmName?: string;
  frnNumber?: string;
};

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'postcode'
  | 'checkbox'
  | 'select'
  | 'radio'
  | 'url'
  | 'hour_min'
  | 'am_pm';

export type InputErrorTypes =
  | 'required'
  | 'invalid'
  | 'invalid_grant'
  | 'expired_token'
  | 'general_error'
  | 'email_exists'
  | 'user_not_found'
  | 'custom_error';

export type CustomAmPmErrorMessageLogic = {
  hideErrorWhenRelatedFieldsAreInvalid?: boolean;
};

export type HideErrorWhen = {
  relatedFieldIsInvalid: boolean;
  relatedFieldKey: string;
};

export type CustomInputValidation = {
  compareTo?: string;
  validationType?: 'lessThan' | 'greaterThan';
  compareToValue?: string;
  hideErrorWhen?: HideErrorWhen;
};

export type InputField = {
  key: string;
  subKey?: string;
  title: string;
  type: FieldType;
  dataPath?: string;
  heading?: string;
  required?: boolean;
  hideWhen?: { field: InputField; value: string };
  hint?: string;
  customValidation?: CustomInputValidation;
};

export type FieldResult =
  | { ok: boolean }
  | {
      error: InputErrorTypes;
    };

export type ApiFormValidationState = {
  ok: boolean;
  fields: Record<string, FieldResult>;
  error: boolean;
};

export interface FcaFirmData {
  Data: {
    firmName?: string;
    'Organisation Name'?: string;
    FRN?: string;
    Status?: string;
  }[];
  status?: string;
}

interface Individual {
  Status: string;
  URL: string;
  IRN: string;
  Name: string;
}

export interface IndividualsApiResponse {
  Status: string;
  ResultInfo: {
    Next?: string;
    page: string;
    per_page: string;
    total_count: string;
  };
  Data: Individual[];
}

export type FormErrorsState = Record<
  string,
  { error: InputErrorTypes; hideErrorWhen?: HideErrorWhen }
>;
