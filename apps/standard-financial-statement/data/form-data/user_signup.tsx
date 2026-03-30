import { Link } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  FormFlowType,
  FormStep,
  QuestionOrg,
  requiredError,
} from './org_signup';

export const orgLicenceNumber = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'orgLicenceNumber',
    group: '',
    title: z({
      en: 'Membership number:',
      cy: 'Rhif aelodaeth:',
    }),
    type: 'text',
    answers: [],
    errors: {
      too_small: z(requiredError),
      not_found: z({
        en: 'Organisation not found',
        cy: 'Sefydliad heb ei ddarganfod',
      }),
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
            className="font-bold text-magenta-800"
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
            className="font-bold text-magenta-800"
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
  formStep: FormStep,
  formFlowType?: FormFlowType,
): QuestionOrg[] => {
  const displayUserFields =
    formStep === FormStep.EXISTING_ORG ||
    formStep === FormStep.NEW_ORG_USER ||
    formStep === FormStep.OTP;
  const displayLicenceNo =
    displayUserFields && formFlowType === FormFlowType.EXISTING_ORG;

  return [
    displayLicenceNo ? orgLicenceNumber(z) : null,
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
      hint: z({
        en: 'Enter your organisational email',
        cy: 'Rhowch eich e-bost sefydliadol',
      }),
      type: 'email',
      answers: [],
      errors: {
        too_small: z(requiredError),
        invalid_string: z({
          en: 'Invalid email address',
          cy: 'Cyfeiriad e-bost annilys',
        }),
        invalid_format: z({
          en: 'Invalid email address',
          cy: 'Cyfeiriad e-bost annilys',
        }),
        user_already_exists: z({
          en: 'An account with this email address already exists. Sign in or use a different email address.',
          cy: 'Mae cyfrif gyda’r cyfeiriad e-bost hwn yn bodoli eisoes. Mewngofnodwch neu defnyddiwch gyfeiriad e-bost gwahanol.',
        }),
        not_allowed: z({
          en: 'The email address you entered is not from your organisation. Please use your organisational email.',
          cy: 'Nid yw’r cyfeiriad e-bost rydych chi wedi’i roi yn dod o’ch sefydliad. Rhowch eich e-bost sefydliad.',
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
      hint: z({
        en: 'Password must be 8+ characters and include at least 3 of the following: uppercase letters, lowercase letters, numbers, or special characters (like !@#$%&)',
        cy: "Rhaid i'r cyfrinair fod yn 8+ nod a chynnwys o leiaf 3 o'r canlynol: llythrennau mawr, llythrennau bach, rhifau, neu nodau arbennig (fel !@#$%&)",
      }),
      group: '',
      title: z({
        en: 'Password',
        cy: 'Cyfrinair',
      }),
      type: 'password',
      answers: [],
      errors: passwordErrors(z),
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
      errors: passwordErrors(z),
    },
    codeOfConduct(z),
  ].filter(Boolean) as QuestionOrg[];
};

const passwordErrors = (z: ReturnType<typeof useTranslation>['z']) => ({
  too_small: z(requiredError),
  invalid_type: z({
    en: 'Please ensure your password and password confirmation are identical.',
    cy: 'Sicrhewch fod eich cyfrinair a chadarnhad cyfrinair yn unfath.',
  }),
  password_banned: z({
    en: 'Please ensure your password does not contain your name, any common words or repeated characters.',
    cy: 'Please ensure your password does not contain your name, any common words or repeated characters.',
  }),
  custom: z({
    en: 'Password must be 8+ characters and include at least 3 of the following: uppercase letters, lowercase letters, numbers, or special characters (like !@#$%&)',
    cy: "Rhaid i'r cyfrinair fod yn 8+ nod a chynnwys o leiaf 3 o'r canlynol: llythrennau mawr, llythrennau bach, rhifau, neu nodau arbennig (fel !@#$%&)",
  }),
});

export const userFormOTP = (
  z: ReturnType<typeof useTranslation>['z'],
  emailAddress?: string,
): QuestionOrg[] | null[] => {
  return [
    {
      questionNbr: 1,
      name: 'otp',
      group: '',
      title: z({
        en: 'One-time passcode',
        cy: 'Cod mynediad untro',
      }),
      description: z({
        en: 'Please enter the One-time passcode which has been sent to:',
        cy: 'Rhowch y Cod Mynediad Untro sydd wedi’i anfon at:',
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
        invalid_grant: z({
          en: 'Incorrect one-time passcode. Please check the code and try again.',
          cy: 'Rhowch y Cod Mynediad Untro sydd wedi’i anfon at:',
        }),
        expired_token: z({
          en: `This one-time passcode has expired. We have sent a new code to ${emailAddress}. Please enter the new code below.`,
          cy: `Mae’r Cod Mynediad Untro hwn wedi dod i ben. Rydym wedi anfon cod newydd at ${emailAddress}. Rhowch y cod newydd isod.`,
        }),
      },
    },
  ];
};
