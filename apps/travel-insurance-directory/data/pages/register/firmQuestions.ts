import { CalloutVariant } from '@maps-react/common/components/Callout';

import { PageData } from './types';

export const page: PageData = {
  step1: {
    heading: 'Are your customers covered?',
    hideOnDetailsPage: true,
    copy: [
      {
        component: 'callout',
        variant: CalloutVariant.WARNING,
        style: 'mb-8',
        heading: {
          component: 'heading',
          content:
            'For a firm to be on the register it must demonstrate that it has:',
          level: 'h4',
          componentLevel: 'h2',
          style: 'mb-4',
        },
        copy: [
          {
            component: 'list',
            style: 'unordered',
            items: [
              {
                label:
                  'the capability to assess the risk profile of applicants for travel insurance policies that cover more serious medical conditions ("Relevant Capability")',
              },
              {
                label:
                  'the risk appetite to offer such policies ("Relevant Risk Appetite")',
              },
            ],
          },
        ],
      },
      {
        component: 'paragraph',
        style: 'font-medium',
        content:
          "Are the firm's customers fully covered by the UK Financial Ombudsman Service (FOS) and the UK Financial Services Compensation Scheme (FSCS)?",
      },
    ],
    radioInput: {
      key: 'covered_by_ombudsman_question',
      layout: 'row',
      options: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    },
  },

  step2: {
    heading: 'How does your firm assess medical risk?',
    backLink: '/register/firm/step1',
    copy: [
      {
        component: 'paragraph',
        style: 'font-semibold',
        content:
          'Please state whether such capability and appetite is demonstrated by one or more of the following means:',
      },
      {
        component: 'paragraph',
        style: 'font-medium',
        content:
          "Please note that 'Risk Data' means 'data as to the nature and severity of an applicant's medical condition(s)', and 'Underwriting Decision' means 'your firm's decision - or that of an insurer where your firm does not have direct or other underwriting authority - whether or not to agree policy terms with the applicant'.",
      },
    ],
    radioInput: {
      key: 'risk_profile_approach_question',
      layout: 'column',
      options: [
        {
          label:
            'Your firm, or someone on its behalf, undertakes a bespoke consultation with the applicant from which Risk Data is obtained and then assessed in the Underwriting Decision',
          value: 'bespoke',
        },
        {
          label:
            "Your firm, or someone on its behalf, uses your firm's own proprietary medical screening questionnaire, software or other pre-prepared methodology in communicating with the applicant by which means Risk Data is obtained and then assessed in the Underwriting Decision",
          value: 'questionaire',
        },
        {
          label:
            'Your firm, or someone on its behalf, uses in communicating with the applicant a medical screening questionnaire, software or pre-prepared methodology that is not proprietary to your firm but by which Risk Data is obtained and then assessed in the Underwriting Decision',
          value: 'non-proprietary',
        },
        {
          label: 'None of the above',
          value: 'neither',
        },
      ],
    },
  },

  step3: {
    heading: 'Confirm you can provide evidence of your capability',
    backLink: '/register/firm/step2',
    copy: [
      {
        component: 'paragraph',
        style: 'font-medium',
        content:
          "Does your firm undertake to produce to MaPS on demand any of the following evidence to demonstrate your firm's Relevant Capability and Relevant Risk Appetite, and in particular a clear track record or objectively realistic plan for effecting, carrying out and distributing travel insurance policies that cover more serious medical conditions:",
      },
      {
        component: 'list',
        style: 'unordered',
        items: [
          { label: 'regulatory returns or submissions;' },
          {
            label:
              'delegated authority or other insurance distribution agreements, plus performance data arising from the operation thereof;',
          },
          {
            label:
              'copy policy and other customer-facing compliance documentation (eg IPID)',
          },
        ],
      },
    ],
    radioInput: {
      key: 'supplies_document_when_needed_question',
      layout: 'row',
      options: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    },
  },
};
