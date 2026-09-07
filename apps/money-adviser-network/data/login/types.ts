export type FormField = {
  name: string;
  label: string;
  info?: string;
  errors: {
    required: string;
    invalid?: string;
  };
};

export type FormFields = FormField[];
