import { render } from '@testing-library/react';

import { Answer, Question } from '@maps-react/form/types';

import { CookieData, FORM_GROUPS } from '../../data/questions/types';
import { ToolLinks } from '../../utils/generateToolLinks';
import { FLOW } from '../../utils/getQuestions';
import { QuestionPage } from './QuestionPage';

import { Questions } from '@maps-react/form/components/Questions';
import '@testing-library/jest-dom';

jest.mock('@maps-react/form/components/Questions', () => ({
  Questions: jest.fn(() => (
    <div data-testid="questions-component">Mocked Questions Component</div>
  )),
}));

jest.mock('../../components/QuestionsWrapper', () => ({
  QuestionsWrapper: jest.fn(({ children }) => (
    <div data-testid="questions-wrapper">{children}</div>
  )),
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

const mockQuestionData: Question[] = [
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
    timeSlot: { value: '' },
    whenToSpeak: { value: '' },
  } as CookieData,
  data: 'test-data',
  currentStep: 1,
  links: mockToolLinks,
  currentFlow: FLOW.START,
  questions: mockQuestionData,
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

  const singleTestCases = [
    {
      description: 'renders single radio options for start flow question 1',
      question: {
        questionNbr: 1,
        title: 'Question 1',
        type: 'single',
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      currentFlow: FLOW.START,
      currentStep: 1,
      prefix: 'q-',
      cookieData: mockProps.cookieData,
      expectedData: {},
    },
    {
      description: 'renders single radio options for online flow question 1',
      question: {
        questionNbr: 1,
        title: 'Question 1',
        type: 'single',
        answers: mockAnswers,
        description: 'Description for question 1',
      },
      currentFlow: FLOW.ONLINE,
      currentStep: 1,
      prefix: 'o-',
      cookieData: mockProps.cookieData,
      expectedData: {},
    },
    {
      description: 'renders single radio options for telephone flow question 4',
      question: {
        questionNbr: 4,
        title: 'Question 4',
        type: 'single',
        answers: mockAnswers,
        description: 'Description for question 4',
      },
      currentStep: 4,
      currentFlow: FLOW.TELEPHONE,
      prefix: 't-',
      cookieData: {
        ...mockProps.cookieData,
        timeSlot: { value: '' },
        whenToSpeak: { value: '0' },
      },
      expectedData: { 't-4': '0' },
    },
    {
      description: 'renders single radio options for telephone flow question 5',
      question: {
        questionNbr: 5,
        title: 'Question 5',
        type: 'single',
        answers: mockAnswers,
        description: 'Description for question 5',
      },
      currentStep: 5,
      currentFlow: FLOW.TELEPHONE,
      prefix: 't-',
      cookieData: {
        ...mockProps.cookieData,
        timeSlot: { value: 'am' },
        whenToSpeak: { value: '1' },
      },
      expectedData: { 't-5': 'am' },
    },
  ];

  singleTestCases.forEach(
    ({
      description,
      question,
      currentStep,
      currentFlow,
      prefix,
      cookieData,
      expectedData,
    }) => {
      it(description, () => {
        const props = {
          ...mockProps,
          question: [question],
          currentStep,
          currentFlow,
          prefix,
          cookieData,
          expectedData,
        };

        const { getByTestId, container } = render(<QuestionPage {...props} />);

        const questionsComponent = getByTestId('questions-component');
        expect(questionsComponent).toBeInTheDocument();

        expect(Questions).toHaveBeenCalledWith(
          expect.objectContaining({
            storedData: expect.objectContaining(expectedData),
          }),
          expect.anything(),
        );

        expect(container.firstChild).toMatchSnapshot();
      });
    },
  );
});
