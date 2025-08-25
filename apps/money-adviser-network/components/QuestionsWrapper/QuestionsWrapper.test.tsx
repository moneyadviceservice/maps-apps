import { render } from '@testing-library/react';

import { Answer, Question } from '@maps-react/form/types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { ToolLinks } from '../../utils/generateToolLinks';
import { FLOW } from '../../utils/getQuestions';
import { QuestionsWrapper } from './QuestionsWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key.en),
  })),
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

const mockStoredData: DataFromQuery = {
  someKey: 'someValue',
};

const mockData = 'someOtherValue:123';

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

const mockAnswers: Answer[] = [];

const mockQuestions: Question[] = [
  {
    questionNbr: 1,
    group: 'Group 1',
    title: 'Question 1',
    type: 'multiple-choice',
    answers: mockAnswers,
    description: 'Description for question 1',
    definition: 'hello',
  },
  {
    questionNbr: 2,
    group: 'Group 2',
    title: 'Question 2',
    type: 'single-choice',
    answers: mockAnswers,
    definition: <>Hello World</>,
  },
];

const mockPageError = <div data-testid="page-error">Page level error</div>;

describe('QuestionsWrapper Component', () => {
  it('should render the component with title, labels, and default values', () => {
    const { getByTestId } = render(
      <QuestionsWrapper
        storedData={mockStoredData}
        data={mockData}
        prevCookieData={mockData}
        currentStep={1}
        questions={mockQuestions}
        links={mockToolLinks}
        currentFlow={FLOW.ONLINE}
        prefix="t-"
      >
        <div data-testid="hello-world">Hello World</div>
      </QuestionsWrapper>,
    );

    const questionsHeading = getByTestId('questions-heading');
    expect(questionsHeading).toBeInTheDocument();
    expect(questionsHeading.textContent).toBe('Question 1');

    const button = getByTestId('step-container-submit-button');
    expect(button.textContent).toBe('Continue');

    const stringDefinition = getByTestId('string-definition');
    expect(stringDefinition).toBeInTheDocument();
    expect(stringDefinition.textContent).toBe('hello');
  });

  it('should display page errors when provided', () => {
    const { getByTestId } = render(
      <QuestionsWrapper
        storedData={mockStoredData}
        data={mockData}
        prevCookieData={mockData}
        currentStep={2}
        questions={mockQuestions}
        links={mockToolLinks}
        currentFlow={FLOW.ONLINE}
        pageError={mockPageError}
        prefix="o-"
      >
        <div data-testid="hello-world">Hello World</div>
      </QuestionsWrapper>,
    );

    const headingTwo = getByTestId('questions-heading');
    expect(headingTwo).toBeInTheDocument();
    expect(headingTwo.textContent).toBe('Question 2');

    const errorElem = getByTestId('page-error');
    expect(errorElem).toBeInTheDocument();
    expect(errorElem.textContent).toBe('Page level error');
  });

  it('should not display error messages when no errors are provided', () => {
    const mockChangedAnswerStoredData: DataFromQuery = {
      someKey: 'someValue',
      changeAnswer: 'o-2',
    };

    const { queryByTestId, getByTestId } = render(
      <QuestionsWrapper
        storedData={mockChangedAnswerStoredData}
        data={mockData}
        prevCookieData={mockData}
        currentStep={2}
        questions={mockQuestions}
        links={mockToolLinks}
        currentFlow={FLOW.ONLINE}
        prefix="o-"
      >
        <div data-testid="hello-world">Hello World</div>
      </QuestionsWrapper>,
    );

    expect(queryByTestId('page-error')).not.toBeInTheDocument();

    expect(getByTestId('prevCookieData')).toHaveValue(mockData);

    const nonStringDefinition = getByTestId('non-string-definition');
    expect(nonStringDefinition).toBeInTheDocument();

    const button = getByTestId('step-container-submit-button');
    expect(button.textContent).toBe('Save changes');
  });
});
