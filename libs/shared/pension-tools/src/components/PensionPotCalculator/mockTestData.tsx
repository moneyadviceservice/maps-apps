import { H2 } from '@maps-react/common/components/Heading';
import { Question } from '@maps-react/form/types';

export const mockDataEn = {
  title: 'Pension Pot Calculator',
  errorTitle: "There's been a problem",
  buttonText: 'Calculate',
  submittedButtonText: 'Recalculate',
  resultsButtonText: 'Apply changes',
  resultTitle: 'Your results',
  calloutMessage: <p>Callout message</p>,
  calloutMessageResults: <p>Callout message results</p>,
};

export const mockerrors = {
  pot: { field: 'pot', type: 'required' },
  age: { field: 'age', type: 'required' },
};

export const mockQuestions: Question[] = [
  {
    questionNbr: 1,
    group: 'pot',
    definition: 'Pot definition',
    title: 'How much is in your pot?',
    type: 'pot',
    subType: 'money',
    target: 'pot',
    useLegend: false,
    description: (
      <p className="text-base text-gray-400 mb-2">
        Le Lorem Ipsum est simplement du faux texte employé dans la composition
        et la mise en page avant impression.
      </p>
    ),
    answers: [],
    classes: [],
    inputProps: {
      labelValue: 'Label Value',
    },
    errors: {
      required: 'Enter a figure',
    },
  },
  {
    questionNbr: 1,
    group: 'age',
    definition: 'Age definition',
    title: 'How old are you?',
    type: 'age',
    subType: 'money',
    target: 'age',
    useLegend: false,
    description: (
      <p className="text-base text-gray-400 mb-2">Age description</p>
    ),
    answers: [],
    classes: [],
    inputProps: {
      labelValue: 'Label Value',
    },
    errors: {
      required: 'Enter a figure',
    },
  },
];

export const analayticsProps = {
  pageName: 'pageName',
  pageTitle: 'pageTitle',
  toolName: 'toolName',
  stepNames: 'Calculate',
  categoryLevels: ['Pensions & retirement', 'Taking your pension'],
};

export const mockResults = () => (
  <div>
    <H2>Your results</H2>
    <p>How much is in your pot?</p>
    <p>£25,000</p>
  </div>
);
