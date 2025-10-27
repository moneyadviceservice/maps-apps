import { Question } from '@maps-react/form/types';

export const mockData = {
  title: 'Cash in chunks Calculator',
  errorTitle: "There's been a problem",
  buttonText: 'Calculate',
  submittedButtonText: 'Recalculate',
  resultsButtonText: 'Apply changes',
  resultTitle: 'Your results',
};

export const mockQuestions: Question[] = [
  {
    questionNbr: 1,
    group: 'income',
    definition: 'What is your yearly income?',
    title: 'What is your yearly income?',
    type: 'income',
    subType: 'money',
    target: 'income',
    useLegend: false,
    description: (
      <p className="text-base text-gray-400 mb-2">
        Include money you get from work
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
    group: 'chunk',
    definition: 'Chunk',
    title: 'How much do you want to take as your first cash chunk',
    type: 'chunk',
    subType: 'money',
    target: 'chunk',
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
    group: 'updateChunk',
    definition: 'Update Chunk',
    title: 'or try a different cash chunk:',
    type: 'updateChunk',
    subType: 'money',
    target: 'updateChunk',
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
];
