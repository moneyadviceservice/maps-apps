import { ErrorType } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Fields, FORM_FIELDS } from '../../data/types';

export const radioInputsErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 1,
      message: z({
        en: 'Select where you live in the UK',
        cy: `Dewiswch ble rydych chi'n byw yn y DU`,
      }),
    },
    {
      question: 6,
      message: z({
        en: 'Choose an option',
        cy: 'Dewiswch opsiwn',
      }),
    },
  ];
};

export const fieldErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Partial<Fields & { default: string }> => ({
  [FORM_FIELDS.day]: z({
    en: 'Enter a valid day',
    cy: 'Rhowch ddyddiad dilys',
  }),
  [FORM_FIELDS.month]: z({
    en: 'Enter a valid month',
    cy: 'Rhowch fis dilys',
  }),
  [FORM_FIELDS.year]: z({
    en: 'Enter a valid year',
    cy: 'Rhowch flwyddyn ddilys',
  }),

  [FORM_FIELDS.day + FORM_FIELDS.month]: z({
    en: 'Enter a valid day and month',
    cy: 'Rhowch ddiwrnod a mis dilys',
  }),
  [FORM_FIELDS.day + FORM_FIELDS.year]: z({
    en: 'Enter a valid day and year',
    cy: 'Rhowch ddiwrnod a blwyddyn ddilys',
  }),
  [FORM_FIELDS.month + FORM_FIELDS.year]: z({
    en: 'Enter a valid month and year',
    cy: 'Rhowch fis a blwyddyn ddilys',
  }),
  [FORM_FIELDS.day + FORM_FIELDS.month + FORM_FIELDS.year]: z({
    en: 'Enter a valid day, month, and year',
    cy: 'Rhowch ddiwrnod, mis a blwyddyn ddilys',
  }),

  [FORM_FIELDS.salary]: z({
    en: 'Enter a salary before tax',
    cy: 'Rhowch gyflog cyn treth',
  }),

  [FORM_FIELDS.additionalRedundancyPay]: z({
    en: `Enter an amount (or select "I don't know")`,
    cy: `Rhowch swm (neu dewiswch 'Dwi ddim yn gwybod) `,
  }),

  [FORM_FIELDS.userAtLeast15YearsOld]: z({
    en: 'Your employment must have started when you were at least 15 years old',
    cy: `Rhaid i’ch cyflogaeth fod wedi dechrau pan oeddech o leiaf 15 oed`,
  }),

  [FORM_FIELDS.employmentStartDateInFuture]: z({
    en: 'Employment start date cannot be in the future',
    cy: `Ni all dyddiad dechrau cyflogaeth fod yn y dyfodol`,
  }),

  [FORM_FIELDS.employmentStartDateAfterRedundancyDate]: z({
    en: 'Employment start date cannot be after redundancy date',
    cy: `Ni all dyddiad dechrau cyflogaeth fod ar ôl y dyddiad diswyddo`,
  }),

  [FORM_FIELDS.redundancyDateMin]: z({
    en: `Redundancy date must be after 1st January ${new Date().getFullYear()}`,
    cy: `Rhaid i'r dyddiad dileu swydd fod ar ôl 1 Ionawr ${new Date().getFullYear()}`,
  }),

  [FORM_FIELDS.redundancyDateMax]: z({
    en: `Redundancy date must be before 31st December ${
      new Date().getFullYear() + 1
    }`,
    cy: `Rhaid i'r dyddiad dileu swydd fod cyn hynny ${
      new Date().getFullYear() + 1
    }`,
  }),

  [FORM_FIELDS.invalidDate]: z({
    en: 'Enter a valid date of birth',
    cy: 'Rhowch ddyddiad geni dilys',
  }),

  [FORM_FIELDS.underAge]: z({
    en: 'You must be at least 15 years old',
    cy: 'Rhaid i chi fod yn 15 oed o leiaf ',
  }),

  default: z({
    en: 'Please select an option to continue.',
    cy: 'Dewiswch opsiwn i barhau.',
  }),
});
