import { Link } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

import { FormType, QuestionOrg, requiredError } from './org_signup';

export const orgLicenceNumber = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'orgLicenceNumber',
    group: '',
    title: z({
      en: 'Membership number:',
      cy: 'Membership number:',
    }),
    type: 'text',
    answers: [],
    errors: {
      too_small: z(requiredError),
    },
  };
};

export const codeOfConduct = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'codeOfConduct',
    group: '',
    title: z({
      en: 'Code of Conduct',
      cy: 'Cod Ymddygiad',
    }),
    definition: z({
      en: (
        <>
          I agree to the{' '}
          <Link
            href="/en/code-of-conduct"
            className="font-bold text-magenta-700"
          >
            Code of Conduct
          </Link>
        </>
      ),
      cy: (
        <>
          I agree to the{' '}
          <Link
            href="/en/code-of-conduct"
            className="font-bold text-magenta-700"
          >
            Code of Conduct
          </Link>
        </>
      ),
    }),
    description: z({
      en: 'Please tick this box to confirm you agree to the SFS Code of Conduct, which provides a guide to best practice use of the SFS.',
      cy: 'Os gwelwch yn dda, ticiwch y blwch hwn i gadarnhau eich bod yn cytuno â Chod Ymddygiad SFS, sy’n darparu canllaw i arferion gorau wrth ddefnyddio’r SFS.',
    }),
    type: 'checkbox',
    answers: [],
    errors: {
      custom: z(requiredError),
    },
  };
};

export const userForm = (
  z: ReturnType<typeof useTranslation>['z'],
  formType: FormType,
): QuestionOrg[] | null[] => {
  return [
    formType === FormType.ACTIVE_ORG ? orgLicenceNumber(z) : null,
    {
      questionNbr: 1,
      name: 'firstName',
      group: '',
      title: z({
        en: 'First Name',
        cy: 'Enw cyntaf',
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 2,
      name: 'lastName',
      group: '',
      title: z({
        en: 'Surname',
        cy: 'Cyfenw',
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 3,
      name: 'emailAddress',
      group: '',
      title: z({
        en: 'Email address',
        cy: 'Cyfeiriad e-bost',
      }),
      type: 'email',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 4,
      name: 'tel',
      group: '',
      title: z({
        en: 'Telephone Number',
        cy: 'Rhif ffôn',
      }),
      type: 'tel',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 5,
      name: 'jobTitle',
      group: '',
      title: z({
        en: 'Job Title',
        cy: 'Teitl y swydd',
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 6,
      name: 'password',
      group: '',
      title: z({
        en: 'Password',
        cy: 'Cyfrinair',
      }),
      type: 'password',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    codeOfConduct(z),
  ].filter(Boolean) as QuestionOrg[];
};
