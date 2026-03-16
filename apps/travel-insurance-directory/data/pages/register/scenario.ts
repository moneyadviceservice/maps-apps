import { RadioInput } from 'components/RadioQuestion/RadioQuestion';

interface ScenarioData {
  step1: PageContent;
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
  backLink: string;
  copy: CopyItem[];
  radioInput: RadioInput;
}

export const page: ScenarioData = {
  step1: {
    heading: 'Scenario pages - not yet copmplete...',
    backLink: '/register/firm/step4',
    copy: [
      {
        component: 'paragraph',
        style: 'font-medium',
        content: 'Scenario question pages....',
      },
    ],
    radioInput: {
      key: 'registerFirm',
      title: 'Select an option',
      layout: 'row',
      options: [
        {
          label: 'Yes',
          value: 'yes',
        },
        {
          label: 'No',
          value: 'no',
        },
      ],
    },
  },
};
