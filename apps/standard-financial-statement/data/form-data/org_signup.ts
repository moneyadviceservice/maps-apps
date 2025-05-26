import { z } from 'zod';

import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

import { deliveryChannel } from './delivery_channel';
import { geoRegions } from './geo_regions';
import { intendedUse } from './intended_use';
import { membershipBody } from './membership_body';
import { organisationTypes } from './organisation_types';

export interface QuestionOrg extends Question {
  name: string;
}

export enum FormType {
  NEW_ORG = 'new',
  NEW_ORG_USER = 'user',
  ACTIVE_ORG = 'active',
}

export const signUpType = (z: ReturnType<typeof useTranslation>['z']) => {
  return [
    { text: z({ en: 'Yes', cy: 'Ydw' }), value: FormType.ACTIVE_ORG },
    { text: z({ en: 'No', cy: 'Nac ydw ' }), value: FormType.NEW_ORG },
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
        en: 'Organisation Name',
        cy: `Eich sefydliad`,
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
        en: 'Organisations Website Address',
        cy: `Cyfeiriad Gwefan Sefydliadau`,
      }),
      type: 'text',
      answers: [],
      errors: {
        too_small: z(requiredError),
        invalid_string: z(requiredError),
      },
    },
    {
      questionNbr: 3,
      name: 'organisationStreet',
      group: '',
      title: z({
        en: 'Organisation Street',
        cy: `Organisation Street`,
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
        en: 'Organisation City',
        cy: `Organisation City`,
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
        en: 'Organisation Postcode',
        cy: `Organisation Postcode`,
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
      en: 'Organisation Type',
      cy: `Organisation Type`,
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
      cy: `Are you live with the SFS?`,
    }),
    type: 'radio',
    answers: [
      { text: z({ en: 'Yes', cy: 'Ydw' }), value: 'true' },
      { text: z({ en: 'No', cy: 'Nac ydw ' }), value: 'false' },
    ],
    errors: {
      too_small: z(requiredError),
    },
  };
};

export const orgGeoRegions = (
  z: ReturnType<typeof useTranslation>['z'],
): QuestionOrg => {
  return {
    questionNbr: 1,
    name: 'geoRegions',
    group: '',
    title: z({
      en: 'What geographical regions do your services cover?',
      cy: `What geographical regions do your services cover?`,
    }),
    description: z({
      en: 'Please select all that apply.',
      cy: `Please select all that apply.`,
    }),
    type: 'checkbox',
    answers: geoRegions.map((type) => ({
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
      cy: `What is your intended use of SFS?`,
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
      invalid_type: z({
        en: 'This value is required.',
        cy: `Rhowch enw sefydliad dilys.`,
      }),
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
      cy: `How do you deliver advice?`,
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
      cy: `Syniad o ddyddiad lansio’r SFS`,
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
      invalid_type: z(requiredError),
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
      en: 'Please provide your FCA Licence number:',
      cy: `Rhowch eich rhif trwydded FCA:`,
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
      cy: 'Os ydych mewn sefydliad cynghori dewiswch pa sefydliad rydych yn aelod ohono:',
    }),
    type: 'single',
    answers: membershipBody.map((type) => ({
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
    ...membershipBody.map((member) => ({
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
