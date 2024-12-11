import { render } from '@testing-library/react';

import { Answer, Question } from '@maps-react/form/types';

import { CookieData, FORM_GROUPS } from '../../data/questions/types';
import { ToolLinks } from '../../utils/generateToolLinks';
import { FLOW } from '../../utils/getQuestions';
import { QuestionPage } from './QuestionPage';

import '@testing-library/jest-dom';

jest.mock('@maps-react/form/components/Questions', () => ({
  Questions: jest.fn(() => <div>Mocked Questions Component</div>),
}));

jest.mock('../../components/QuestionsWrapper', () => ({
  QuestionsWrapper: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../../components/QuestionMultipleSecurity', () => ({
  QuestionMultipleSecurity: () => <div>QuestionMultipleSecurity Component</div>,
}));

jest.mock('../../components/QuestionCustomerDetails', () => ({
  QuestionCustomerDetails: () => <div>QuestionCustomerDetails Component</div>,
}));

jest.mock('../../components/ConsentWrapper', () => ({
  ConsentWrapper: () => <div>ConsentWrapper Component</div>,
}));

jest.mock('../../components/QuestionReferenceDetails', () => ({
  QuestionReferenceDetails: () => <div>QuestionReferenceDetails Component</div>,
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

const mockToolLinks: ToolLinks = {
  question: {
    backLink: '/back',
    goToQuestionOne: '1',
    goToQuestionTwo: '2',
    goToQuestionThree: '3',
  },
  change: {
    backLink: '/back',
    nextLink: '/next',
  },
  confirmation: {
    backLink: '/back',
    start: '/start',
  },
};

const mockAnswers: Answer[] = [
  {
    text: 'Answer 1',
  },
  {
    text: 'Answer 2',
  },
];

const mockQuestions: Question[] = [
  {
    questionNbr: 1,
    group: 'Group 1',
    title: 'Question 1',
    type: 'multiple-choice',
    answers: mockAnswers,
    description: 'Description for question 1',
  },
  {
    questionNbr: 2,
    group: 'Group 2',
    title: 'Question 2',
    type: 'single-choice',
    answers: mockAnswers,
  },
];

const mockProps = {
  storedData: {
    someKey: 'someValue',
  },
  cookieData: {
    securityQuestions: {},
    customerDetails: {},
    consentReferral: { value: '' },
    consentDetails: { value: '' },
    consentOnline: { value: '' },
    reference: {},
  } as CookieData,
  data: 'test-data',
  currentStep: 1,
  links: mockToolLinks,
  isEmbed: false,
  currentFlow: FLOW.START,
  questions: mockQuestions,
  errors: [],
  prefix: 'q-',
  useValueForRadio: false,
  helpSection: <div>Help Section</div>,
  pageError: <div>Page Error</div>,
};

describe('QuestionPage', () => {
  const testCases = [
    {
      description:
        'renders QuestionMultipleSecurity for securityQuestions subType',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: FORM_GROUPS.securityQuestions,
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'QuestionMultipleSecurity Component',
    },
    {
      description:
        'renders QuestionCustomerDetails for customerDetails subType with online flow',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: FORM_GROUPS.customerDetails,
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'QuestionCustomerDetails Component',
      currentFlow: FLOW.ONLINE,
    },
    {
      description:
        'renders QuestionCustomerDetails for customerDetails subType with telephone flow',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: FORM_GROUPS.customerDetails,
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'QuestionCustomerDetails Component',
      currentFlow: FLOW.TELEPHONE,
    },
    {
      description: 'renders ConsentWrapper for consentReferral subType',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: FORM_GROUPS.consentReferral,
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'ConsentWrapper Component',
    },
    {
      description: 'renders ConsentWrapper for consentDetails subType',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: FORM_GROUPS.consentDetails,
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'ConsentWrapper Component',
    },
    {
      description: 'renders ConsentWrapper for consentOnline subType',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: FORM_GROUPS.consentOnline,
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'ConsentWrapper Component',
    },
    {
      description: 'renders QuestionReferenceDetails for reference subType',
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'standalone',
        subType: 'reference',
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      expectedText: 'QuestionReferenceDetails Component',
    },
  ];

  testCases.forEach(({ description, question, expectedText, currentFlow }) => {
    it(description, () => {
      const props = {
        ...mockProps,
        questions: [question],
        ...(currentFlow && { currentFlow: currentFlow }),
      };

      const { getByText } = render(<QuestionPage {...props} />);

      expect(getByText(expectedText)).toBeInTheDocument();
    });
  });

  it('renders Questions component when question type is single', () => {
    const props = {
      ...mockProps,
      question: {
        questionNbr: 1,
        group: 'Group 1',
        title: 'Question 1',
        type: 'single',
        answers: mockAnswers,
        description: 'Description for question 1',
      },
    };

    const { getByText, container } = render(<QuestionPage {...props} />);

    expect(getByText('Mocked Questions Component')).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});
