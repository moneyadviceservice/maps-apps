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

export type FieldType = 'text' | 'email' | 'phone' | 'checkbox';

export type InputErrorTypes =
  | 'required'
  | 'invalid'
  | 'invalid_grant'
  | 'expired_token'
  | 'general_error'
  | 'email_exists';

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
