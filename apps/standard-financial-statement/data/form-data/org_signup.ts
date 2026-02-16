import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

import { deliveryChannel } from './delivery_channel';
import { geoRegions } from './geo_regions';
import { intendedUse } from './intended_use';
import { orderedMembershipBody } from './membership_body';
import { organisationTypes } from './organisation_types';

export interface QuestionOrg extends Question {
  name: string;
  hint?: string;
}

export enum FormFlowType {
  NEW_ORG = 'new',
  EXISTING_ORG = 'existing',
}

export enum FormStep {
  NEW_ORG = 'new',
  NEW_ORG_USER = 'user',
  EXISTING_ORG = 'active',
  OTP = 'otp',
  SUCCESS = 'success',
}

export const signUpType = (z: ReturnType<typeof useTranslation>['z']) => {
  return [
    { text: z({ en: 'Yes', cy: 'Ydw' }), value: FormFlowType.EXISTING_ORG },
    { text: z({ en: 'No', cy: 'Nac ydw' }), value: FormFlowType.NEW_ORG },
  ];
};

export const requiredError = {
  en: 'This value is required.',
  cy: `Mae angen y gwerth hwn.`,
};

export const orgAddressQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg[] => {
  return [
    {
      questionNbr: 1,
      name: 'organisationName',
      group: '',
      title: z({
        en: 'Organisation name',
        cy: `Enw’r sefydliad`,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 2,
      name: 'organisationWebsite',
      group: '',
      title: z({
        en: 'Organisation website address (optional)',
        cy: `Cyfeiriad gwefan y sefydliad (dewisol)`,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
        invalid_string: z({
          en: 'Please enter a valid URL.',
          cy: `Rhowch gyfeiriad gwe dilys.`,
        }),
        invalid_format: z({
          en: 'Please enter a valid URL.',
          cy: `Rhowch gyfeiriad gwe dilys.`,
        }),
      },
    },
    {
      questionNbr: 3,
      name: 'organisationStreet',
      group: '',
      title: z({
        en: 'Organisation street address',
        cy: `Cyfeiriad stryd y sefydliad`,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 4,
      name: 'organisationCity',
      group: '',
      title: z({
        en: 'Organisation town/city',
        cy: `Tref/dinas y sefydliad`,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
    {
      questionNbr: 5,
      name: 'organisationPostcode',
      group: '',
      title: z({
        en: 'Organisation postcode',
        cy: `Cod post y sefydliad`,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    },
  ];
};

export const orgType = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'organisationType',
    group: '',
    title: z({
      en: 'What type of organisation are you?',
      cy: `Pa fath o sefydliad ydych chi?`,
    }),
    type: 'select',
    answers: organisationTypes.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.value,
    })),
    errors: {
      invalid_type: z({
        en: 'This value is required.',
        cy: `Rhowch enw sefydliad dilys.`,
      }),
      too_small: z(requiredError),
    },
  };
};

export const orgLive = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'sfslive',
    group: '',
    title: z({
      en: 'Are you live with the SFS?',
      cy: `A ydych yn gwneud defnydd byw o'r SFS?`,
    }),
    type: 'radio',
    answers: [
      { text: z({ en: 'Yes', cy: 'Ydw' }), value: 'true' },
      { text: z({ en: 'No', cy: 'Nac ydw' }), value: 'false' },
    ],
    errors: {
      too_small: z(requiredError),
    },
  };
};

const orderedGeoRegions = geoRegions?.sort((a, b) =>
  a.key.localeCompare(b.key),
);

export const orgGeoRegions = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'geoRegions',
    group: '',
    title: z({
      en: 'What geographical regions does your services cover?',
      cy: `Pa ranbarthau daearyddol sy'n cael eu cynnwys gan eich gwasanaethau?`,
    }),
    description: z({
      en: 'Select all that apply',
      cy: `Ticiwch bob un sy'n berthnasol`,
    }),
    type: 'checkbox',
    answers: orderedGeoRegions.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.key,
    })),
    errors: {
      invalid_type: z({
        en: 'Please select type',
        cy: `Rhowch enw sefydliad dilys.`,
      }),
      too_small: z(requiredError),
    },
  };
};

export const orgUse = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'organisationUse',
    group: '',
    title: z({
      en: 'What is your intended use of SFS?',
      cy: `Beth yw’ch defnydd arfaethedig o SFS?`,
    }),
    type: 'select',
    answers: intendedUse.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.value,
    })),
    errors: {
      too_small: z(requiredError),
    },
  };
};

export const debtAdvice = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'debtAdvice',
    group: '',
    title: z({
      en: 'How do you deliver advice?',
      cy: `Sut ydych chi’n darparu cyngor?`,
    }),
    type: 'checkbox',
    answers: deliveryChannel.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.key,
    })),
    errors: {
      too_small: z(requiredError),
      invalid_type: z({
        en: 'This value is required.',
        cy: `Rhowch enw sefydliad dilys.`,
      }),
    },
  };
};

export const debtAdviceOther = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'debtAdviceOther',
    group: '',
    title: '',
    type: 'single',
    answers: [],
    errors: {
      too_small: z(requiredError),
      invalid_type: z({
        en: 'This value is required.',
        cy: `Rhowch enw sefydliad dilys.`,
      }),
    },
  };
};

export const orgLaunchDate = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'sfsLaunchDate',
    group: '',
    title: z({
      en: 'SFS Launch date (or estimated launch date)',
      cy: `Dyddiad lawnsio SFS (neu ddyddiad lawnsio arfaethedig)`,
    }),
    type: 'date',
    answers: intendedUse.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.value,
    })),
    errors: {
      invalid_type: z({
        en: 'Please enter a valid date.',
        cy: `Rhowch dyddiad dilys.`,
      }),
      too_small: z(requiredError),
    },
  };
};

export const orgSoftware = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'caseManagementSoftware',
    group: '',
    title: z({
      en: 'Name of case management software used (if applicable)',
      cy: `Enw’r meddalwedd rheoli achosion a ddefnyddir (os yn berthnasol)`,
    }),
    type: 'text',
    answers: intendedUse.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.value,
    })),
    errors: {
      invalid_type: z({
        en: 'Please select type',
        cy: `Rhowch enw sefydliad dilys.`,
      }),
      too_small: z(requiredError),
    },
  };
};

export const orgFcaReg = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'fcaReg',
    group: '',
    title: z({
      en: 'Is your organisation registered with the Financial Conduct Authority?',
      cy: `A yw eich sefydliad wedi'i gofrestru gyda'r Awdurdod Ymddygiad Ariannol?`,
    }),
    type: 'radio',
    answers: [
      { text: z({ en: 'Yes', cy: 'Ydw' }), value: 'fca-yes' },
      { text: z({ en: 'No', cy: 'Nac ydw ' }), value: 'fca-no' },
    ],
    errors: {
      too_small: z(requiredError),
    },
  };
};

export const orgFcaRegNumber = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'fcaRegNumber',
    group: '',
    title: z({
      en: 'Please provide your FCA License number',
      cy: `Rhowch eich rhif Trwydded FCA`,
    }),
    type: 'single',
    answers: [],
    errors: {
      too_small: z(requiredError),
    },
  };
};

export const membershipBodyOpt = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'memberships',
    group: '',
    title: z({
      en: 'If you belong to a trade or membership body, please select from the list below:',
      cy: `Os ydych chi'n perthyn i gorff masnachu neu aelodaeth, dewiswch o'r rhestr isod:`,
    }),
    type: 'single',
    answers: orderedMembershipBody.map((type) => ({
      text: z({
        en: type.en,
        cy: type.cy,
      }),
      value: type.key,
    })),
    errors: {
      too_small: z(requiredError),
    },
  };
};

export const allQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg[] => {
  return [
    ...orgAddressQuestions(z),
    orgLaunchDate(z),
    orgSoftware(z),
    orgFcaReg(z),
    orgFcaRegNumber(z),
    membershipBodyOpt(z),
    orgType(z),
    orgLive(z),
    orgGeoRegions(z),
    orgUse(z),
    debtAdvice(z),
    debtAdviceOther(z),
    ...orderedMembershipBody.map((member) => ({
      questionNbr: 1,
      name: member.key,
      group: '',
      title: z({
        en: member.en,
        cy: member.cy,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
      },
    })),
  ];
};
