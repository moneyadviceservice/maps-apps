import { RadioInput } from 'components/RadioQuestion/RadioQuestion';

interface Data {
  step1: PageContent;
  step2: PageContent;
  step3: PageContent;
  step4: PageContent;
}

interface Paragraph {
  component: 'paragraph';
  style: string;
  content: string;
}

interface List {
  component: 'list';
  style: string;
  items: string[];
}

export type CopyItem = Paragraph | List;

interface PageContent {
  heading: string;
  backLink?: string;
  nextPage?: string;
  copy: CopyItem[];
  radioInput: RadioInput;
}

export const page: Data = {
  step1: {
    heading: 'Register your firm',
    copy: [
      {
        component: 'paragraph',
        style: 'font-medium',
        content:
          "Are the firm's customers fully covered by the UK Financial Ombudsman Service (FOS) and the UK Financial Services Compensation Scheme (FSCS)?",
      },
    ],
    radioInput: {
      key: 'covered_by_ombudsman_question',
      title: 'Select an option',
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
      title: 'Select an option',
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
          'regulatory returns or submissions; ',
          'delegated authority or other insurance distribution agreements, plus performance data arising from the operation thereof;',
          'copy policy and other customer-facing compliance documentation (eg IPID)',
        ],
      },
    ],
    radioInput: {
      key: 'supplies_document_when_needed_question',
      title: 'Select an option',
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

  step4: {
    heading: 'Which medical conditions does your firm cover?',
    backLink: '/register/firm/step3',
    nextPage: '/register/scenario/step1',
    copy: [
      {
        component: 'paragraph',
        style: 'font-medium',
        content: 'Please select one of the following',
      },
    ],
    radioInput: {
      key: 'covers_medical_condition_question',
      title: 'Select an option',
      layout: 'column',
      options: [
        {
          label:
            'Does your firm only offer travel insurance for one specific serious medical condition?',
          value: 'one_specific',
          hintText:
            'Firms that offer cover for one specific type of serious medical condition (e.g. cancer or heart conditions) will be eligible to register onto the Directory but must confirm on their profile the medical condition they specialise in.',
        },
        {
          label:
            'Does your firm offer travel insurance that will cover any/most types of serious medical conditions?',
          value: 'all',
          hintText:
            'Firms that offer cover for any or most types of serious medical conditions will be asked to confirm whether they would offer cover without medical exclusions in certain hypothetical medical scenarios listed on the next screen.',
        },
      ],
    },
  },
};
