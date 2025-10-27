import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Fields, FORM_FIELDS } from '../../../types/types';

const currentYear = new Date().getFullYear();
const minYear = currentYear - 5;

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

  [FORM_FIELDS.dueDateMin]: z({
    en: `Due date cannot be before 1st January ${minYear}`,
    cy: `Ni all y dyddiad disgwyliedig fod cyn 1 Ionawr" ${minYear}`,
  }),

  [FORM_FIELDS.invalidDate]: z({
    en: 'Enter a valid due date',
    cy: 'Rhowch ddyddiad dilys i barhau',
  }),

  default: z({
    en: 'Enter a valid due date',
    cy: 'Rhowch ddyddiad dilys i barhau',
  }),
});
