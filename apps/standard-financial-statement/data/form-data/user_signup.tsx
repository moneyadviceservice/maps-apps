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
      en: 'Code of Conduct agreement',
      cy: 'Cytundeb Cod Ymddygiad',
    }),
    definition: z({
      en: (
        <>
          I agree to the{' '}
          <Link
            href="/en/apply-to-use-the-sfs/sfs-code-of-conduct"
            className="font-bold text-magenta-700"
            target="_blank"
            withIcon={false}
          >
            Code of Conduct
          </Link>
        </>
      ),
      cy: (
        <>
          Rwy’n cytuno i’r{' '}
          <Link
            href="/cy/apply-to-use-the-sfs/sfs-code-of-conduct"
            className="font-bold text-magenta-700"
            target="_blank"
            withIcon={false}
          >
            Cod Ymddygiad
          </Link>
        </>
      ),
    }),
    description: z({
      en: 'Please tick this box to confirm you agree to the SFS Code of Conduct, which provides a guide to best practice use of the SFS.',
      cy: 'Ticiwch y blwch hwn i gadarnhau eich bod yn cytuno i God Ymddygiad SFS, sy’n darparu canllaw i arfer gorau o ddefnyddio’r SFS.',
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
        en: 'First name',
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
        invalid_string: z({
          en: 'Invalid email address',
          cy: 'Cyfeiriad e-bost annilys',
        }),
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
      type: 'number',
      answers: [],
      errors: {
        too_small: z(requiredError),
        invalid_type: z({
          en: 'Invalid number',
          cy: 'invalid number',
        }),
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
        invalid_type: z({
          en: 'Password match',
          cy: 'Password match',
        }),
      },
    },
    {
      questionNbr: 7,
      name: 'confirmPassword',
      group: '',
      title: z({
        en: 'Confirm Password',
        cy: 'Cadarnhau cyfrinair',
      }),
      type: 'password',
      answers: [],
      errors: {
        too_small: z(requiredError),
        invalid_type: z({
          en: 'Password match',
          cy: 'Password match',
        }),
      },
    },
    codeOfConduct(z),
  ].filter(Boolean) as QuestionOrg[];
};

export const userFormOTP = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg[] | null[] => {
  return [
    {
      questionNbr: 1,
      name: 'otp',
      group: '',
      title: z({
        en: 'One-time passcode',
        cy: 'One-time passcode',
      }),
      description: z({
        en: 'Please enter the one-time passcode sent to your email address.',
        cy: 'Os gwelwch yn dda, rhowch y cod unwaith a anfonwyd at eich cyfeiriad e-bost.',
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
  ];
};
