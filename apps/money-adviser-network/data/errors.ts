import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Fields, FORM_FIELDS } from './questions/types';

export type ErrorType = {
  question: number | string;
  message: string;
};

export type PageErrors = {
  [x: number | string]: string[];
};

export const errorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // default if no specific question is supplied
      message: z({
        en: 'Please select an option to continue.',
        cy: 'Dewiswch opsiwn i barhau.',
      }),
    },
    {
      question: 1,
      message: z({
        en: 'Select whether the customer needs help with day-to-day money management or with debt.',
        cy: "Dewiswch a ydy'r cwsmer angen help gyda rheoli arian o ddydd i ddydd neu gyda dyled.",
      }),
    },
    {
      question: 2,
      message: z({
        en: 'Select whether the customer lives in England or not.',
        cy: "Dewiswch a ydy'r cwsmer yn byw yn Lloegr ai peidio",
      }),
    },
    {
      question: 3,
      message: z({
        en: 'Select whether the customer is self employed / a company director (yes) - or neither (no)',
        cy: "Dewiswch a yw'r cwsmer yn hunangyflogedig / yn gyfarwyddwr cwmni (ie) - neu ddim (na)",
      }),
    },
    {
      question: 4,
      message: z({
        en: 'Select whether the customer wants help online, by phone or face to face.',
        cy: "Dewiswch a ydy'r cwsmer eisiau help ar-lein, dros y ffôn neu wyneb yn wyneb.",
      }),
    },
  ];
};

export const onlineGenErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // default if no specific question is supplied
      message: z({
        en: 'Please select an option to continue.',
        cy: 'Dewiswch opsiwn i barhau.',
      }),
    },
  ];
};

export const telephoneGenErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // default if no specific question is supplied
      message: z({
        en: 'Please select an option to continue.',
        cy: 'Dewiswch opsiwn i barhau.',
      }),
    },
    {
      question: 4,
      message: z({
        en: 'Select whether the customer wants an immediate callback or a call scheduled for later.',
        cy: "Dewiswch a ydy'r cwsmer eisiau galwad yn ôl yn syth neu eisiau trefnu galwad yn hwyrach",
      }),
    },
    {
      question: 5,
      message: z({
        en: "Please select the customer's preferred time slot",
        cy: "Dewiswch slot amser a fyddai'n well gan y cwsmer",
      }),
    },
  ];
};

export const fieldErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Partial<Fields & { default: string }> => ({
  [FORM_FIELDS.consentDetails]: z({
    en: 'Select whether the customer gives their consent or not.',
    cy: "Dewiswch a ydy'r cwsmer yn cydsynio ai peidio.",
  }),
  [FORM_FIELDS.consentReferral]: z({
    en: 'Select whether the customer gives their consent or not.',
    cy: "Dewiswch a ydy'r cwsmer yn cydsynio ai peidio.",
  }),
  [FORM_FIELDS.consentOnline]: z({
    en: 'Select whether the customer gives their consent or not.',
    cy: "Dewiswch a ydy'r cwsmer yn cydsynio ai peidio.",
  }),
  [FORM_FIELDS.firstName]: z({
    en: 'First name must be between 2 and 50 characters, including only letters a to z and special characters such as hyphens, underscores, and apostrophes.',
    cy: "Rhaid i'r enw cyntaf fod rhwng 2 a 50 nod, gan gynnwys llythrennau A to z yn unig a chymeriadau arbennig fel cysylltnodau, tanlinellau a chollnodau.",
  }),
  [FORM_FIELDS.lastName]: z({
    en: 'Last name must be between 2 and 50 characters, including only letters a to z and special characters such as hyphens, underscores, and apostrophes.',
    cy: "Rhaid i'r enw olaf fod rhwng 2 a 50 nod, gan gynnwys llythrennau A to z yn unig a chymeriadau arbennig fel cysylltnodau, tanlinellau a chollnodau.",
  }),
  [FORM_FIELDS.email]: z({
    en: 'Enter an email address of up to 100 characters in the correct format, like name@example.com',
    cy: 'Rhowch gyfeiriad e-bost o hyd at 100 o gymeriadau yn y fformat cywir, fel enw@enghraifft.com',
  }),
  [FORM_FIELDS.telephone]: z({
    en: 'Phone number must be a valid UK number. Please do not include spaces or special characters. However, it can include +44 to start. E.g. +441234567890',
    cy: "Rhaid i'r rhif ffôn fod yn rhif dilys yn y Deyrnas Unedig. Peidiwch â chynnwys bylchau neu nodau arbennig. Fodd bynnag, gall gynnwys +44 i ddechrau. e.e. +441234567890",
  }),
  [FORM_FIELDS.customerReference]: z({
    en: 'Your Internal Customer Reference must be a value up to 20 characters long and only include letters, numbers and special characters such as hyphens, spaces, forward slashes and underscores.',
    cy: "Rhaid i'ch Cyfeirnod Cwsmer Mewnol fod yn werth hyd at 20 nod o hyd a dim ond cynnwys llythyrau, rhifau a chymeriadau arbennig fel cysylltnodau, bylchau, blaenslaesau ac tanlinellau.",
  }),
  [FORM_FIELDS.departmentName]: z({
    en: 'Your Name / Department name must be a value up to 40 characters long and only include letters, numbers and special characters such as hyphens, spaces, forward slashes and underscores.',
    cy: "Rhaid i'ch Enw / Enw Adran fod yn werth hyd at 40 nod o hyd a dim ond cynnwys llythyrau, rhifau a chymeriadau arbennig fel cysylltnodau, bylchau, blaenslaesau ac tanlinellau.",
  }),
  [FORM_FIELDS.securityQuestion]: z({
    en: 'Please select an item for the security question',
    cy: 'Dewiswch eitem ar gyfer y cwestiwn diogelwch',
  }),
  [FORM_FIELDS.securityAnswer]: z({
    en: 'Please enter your answer for the security question',
    cy: 'Rhowch eich ateb ar gyfer y cwestiwn diogelwch',
  }),
  [FORM_FIELDS.postcode]: z({
    en: "Please enter the customer's postcode",
    cy: 'Rhowch god post y cwsmer',
  }),
  default: z({
    en: 'Please select an option to continue.',
    cy: 'Dewiswch opsiwn i barhau.',
  }),
});

type FormatErrors = {
  'postcode-format': string;
};
export const formatErrors = (
  z: ReturnType<typeof useTranslation>['z'],
): Partial<FormatErrors> => ({
  ['postcode-format']: z({
    en: "This isn't a valid postcode.",
    cy: 'Nid yw hwn yn gôd post dilys.',
  }),
});

const frontendLogicErrors = {
  outOfOfficeHours: 'Out of office hours',
  invalidSlotFormat: 'Invalid slot format',
};

const serverErrorMessages = {
  allDataMissing: 'Error - All required data is missing from request.',
  NoSlotForDate:
    'Error - No booking slot found for Date {slotdate} and type {slotType}',
  capacityFull: 'Error - Booking slot capacity is full.',
  contactRecordsIssue:
    'Error - More than one active contact records in system for provided inputs.',
  noSlotsAvailable:
    'There are no telephone slots available. Please try again tomorrow. Alternatively, you can select the online advice tool.',
  requiredDataMissing: 'Error - Required data is missing from request.',
  default: 'Error - {ex.Message}',
};

export const allSubmitErrors = {
  ...frontendLogicErrors,
  ...serverErrorMessages,
};

/**
Error Messages
Error - All required data is missing from request.

Triggered when any of the required fields (slot, contactfirstname, contactlastname, Phone) in the appointmentMessage object are missing or empty.
Error - No booking slot found for Date {slotdate} and type {slotType}

Triggered when no booking slot is found in the CRM system for the given date (slotdate) and slot type (slotType).
Error - Booking slot capacity is full.

Triggered when the booking slot's remainingbookings attribute is 0 or if currentbookings equals the capacity.
Error - More than one active contact records in system for provided inputs.

Triggered when the CRM query retrieves more than one active contact record matching the provided inputs (contactfirstname, contactlastname, and Phone).
There are no telephone slots available. Please try again tomorrow. Alternatively, you can select the online advice tool.

Triggered when the booking slot's capacity is full, specifically during the booking slot capacity check.
Error - {ex.Message}

A generic error message caught and logged when any exception occurs during the process. The actual message is determined by the caught exception (ex.Message).
Potential Sources of Exception
Date Parsing Error:

An exception may occur if the slot field cannot be parsed using the DateTime.ParseExact method.
Example error: String was not recognized as a valid DateTime.
Null Reference Error:

If a required property in the appointmentMessage object is null and accessed directly without a null check.
Service Errors:

If the CRM service is not ready or fails during any operation (e.g., RetrieveMultiple, Create).
Mutex Errors:

Mutex acquisition or release errors, although these are less likely due to the safeguards in the code.
These error messages are either explicitly thrown or logged within the function, ensuring traceability for various failure points.
 */
