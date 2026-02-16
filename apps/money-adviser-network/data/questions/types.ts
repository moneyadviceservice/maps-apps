export const FORM_FIELDS = {
  consentDetails: 'consentDetails',
  consentReferral: 'consentReferral',
  consentOnline: 'consentOnline',
  customerReference: 'customerReference',
  departmentName: 'departmentName',
  whenToSpeak: 'whenToSpeak',
  timeSlot: 'timeSlot',
  firstName: 'firstName',
  lastName: 'lastName',
  telephone: 'telephone',
  email: 'email',
  postcode: 'postcode',
  securityQuestion: 'securityQuestion',
  securityAnswer: 'securityAnswer',
} as const;

export const SingleFieldGroups = {
  consentDetails: ['consentDetails'],
  consentReferral: ['consentReferral'],
  consentOnline: ['consentOnline'],
  whenToSpeak: ['whenToSpeak'],
  timeSlot: ['timeSlot'],
} as const;

const MultiFieldGroups = {
  reference: ['customerReference', 'departmentName'],
  customerDetails: ['firstName', 'lastName', 'telephone', 'email'],
  securityQuestions: ['postcode', 'securityQuestion', 'securityAnswer'],
} as const;

const FIELD_GROUPS = {
  ...SingleFieldGroups,
  ...MultiFieldGroups,
} as const;

export const FORM_GROUPS = Object.keys(FIELD_GROUPS).reduce((acc, key) => {
  acc[key as keyof typeof FIELD_GROUPS] = key as keyof typeof FIELD_GROUPS;
  return acc;
}, {} as Record<keyof typeof FIELD_GROUPS, keyof typeof FIELD_GROUPS>);

export type Fields = {
  [Key in keyof typeof FORM_FIELDS]: string;
};

export type CookieData = {
  [Group in keyof typeof SingleFieldGroups]?: {
    value: string;
  };
} & {
  [Group in keyof typeof MultiFieldGroups]?: {
    [Field in (typeof MultiFieldGroups)[Group][number]]: string;
  };
};
