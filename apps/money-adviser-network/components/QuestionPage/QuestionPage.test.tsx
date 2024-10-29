import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { QuestionPage } from './QuestionPage';
import { Questions } from '@maps-react/form/components/Questions';
import { ToolLinks } from 'utils/generateToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { Question, Answer } from '@maps-react/form/types';

jest.mock('@maps-react/form/components/Questions', () => ({
  Questions: jest.fn(() => <div>Mocked Questions Component</div>),
}));

describe('QuestionPage', () => {
  const mockStoredData: DataFromQuery = {
    someKey: 'someValue',
  };

  const mockToolLinks: ToolLinks = {
    question: {
      backLink: '/back',
      goToQuestionOne: '1',
      goToQuestionTwo: '2',
    },
    change: {
      backLink: '/back',
      nextLink: '/next',
    },
    summary: {
      backLink: '/back',
      nextLink: '/next',
    },
    result: {
      backLink: '/back',
      firstStep: '/first',
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

  const props = {
    storedData: mockStoredData,
    data: 'test-data',
    currentStep: 1,
    links: mockToolLinks,
    isEmbed: false,
    toolPath: '/tool-path',
    questions: mockQuestions,
    errors: [],
  };

  it('should render Questions component with correct props', () => {
    const { container, getByText } = render(<QuestionPage {...props} />);

    expect(getByText('Mocked Questions Component')).toBeInTheDocument();

    expect(Questions).toHaveBeenCalledWith(
      {
        storedData: props.storedData,
        data: props.data,
        questions: props.questions,
        errors: props.errors,
        currentStep: props.currentStep,
        backLink: props.links.question.backLink,
        dataPath: props.toolPath,
        apiCall: '/api/submit-answer',
        isEmbed: props.isEmbed,
        alwaysDisplaySubText: true,
      },
      {},
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
