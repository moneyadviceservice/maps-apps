import React from 'react';

import { twMerge } from 'tailwind-merge';
import { fireEvent, render, screen } from '@testing-library/react';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';

import { ErrorType, Question } from '../../types';
import { Questions } from './Questions';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(),
}));

const questions = [
  {
    questionNbr: 1,
    title: 'Question 1',
    group: 'Group 1',
    type: 'single',
    answers: [
      { text: 'Option 1', clearAll: false, score: 1 },
      { text: 'Option 2', clearAll: false, score: 1 },
    ],
  },
  {
    questionNbr: 2,
    title: 'Question 2',
    group: 'Group 2',
    type: 'multiple',
    answers: [
      { text: 'Option 1', clearAll: false, score: 1 },
      { text: 'Option 2', clearAll: false, score: 1 },
      { text: 'Option 3', clearAll: true, score: 1 },
    ],
  },
  {
    questionNbr: 3,
    title: 'Question 3',
    group: 'Group 3',
    type: 'moneyInput',
    answers: [{ text: '', clearAll: false }],
  },
  {
    questionNbr: 4,
    title: 'Question 4',
    group: 'Group 4',
    type: 'single',
    subType: 'text',
    answers: [],
  },
];

const mockErrors = [
  { question: 1, message: 'Error message for question 1' },
  { question: 2, message: 'Error message for question 2' },
  { question: 3, message: 'Error message for question 3' },
  { question: 4, message: 'Error message for question 4' },
];

const storedData = {};

const errors: ErrorType[] = [];

const props = {
  storedData,
  data: '',
  questions,
  errors,
  dataPath: 'mid-life-mot',
  currentStep: 1,
  backLink: '/back',
  apiCall: '/api/call',
  isEmbed: false,
};

const createPropsWithQuestions = (questions: Question[]) => ({
  ...props,
  useValue: true,
  questions,
});

const createQuestion = (overrides: Partial<Question> = {}): Question => ({
  questionNbr: 1,
  title: 'Question 1',
  group: 'Group 1',
  type: 'single',
  subType: 'text',
  answers: [],
  ...overrides,
});

describe('Questions Component', () => {
  let addStepPageMock: jest.Mock;

  beforeEach(() => {
    addStepPageMock = jest.fn();

    (useAnalytics as jest.Mock).mockReturnValue({
      addStepPage: addStepPageMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders radio question correctly with provided props', () => {
    const { getByText, getByLabelText, getByTestId } = render(
      <Questions {...props} />,
    );

    expect(getByText('Question 1')).toBeInTheDocument();
    expect(getByLabelText('Option 1')).toBeInTheDocument();
    expect(getByLabelText('Option 2')).toBeInTheDocument();
    expect(getByTestId('radio-input-0')).toHaveAttribute('value', '0');

    const radioButton = getByLabelText('Option 2');
    fireEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  });
  it('should render error message for step 1 when there is an error', () => {
    const mockErrors = [
      { question: 1, message: 'Select where you live in the UK' },
    ];

    const updatedProps = {
      ...props,
      currentStep: 1,
      errors: mockErrors,
    };

    const { getByTestId } = render(<Questions {...updatedProps} />);

    const errorElement = getByTestId('error-1');
    expect(errorElement).toBeInTheDocument();
  });

  it('handles inputCheckbox subType correctly based on storedData', () => {
    const questions = [
      {
        questionNbr: 7,
        title: 'Question 7',
        group: 'Group 7',
        type: 'moneyInput',
        subType: 'inputCheckbox',
        answers: [{ text: '', value: '1' }],
      },
    ];

    const storedData = {
      'q-7': ',1',
    };

    const updatedProps = {
      ...props,
      questions,
      storedData,
      currentStep: 7,
    };

    const { getByTestId } = render(<Questions {...updatedProps} />);

    const checkbox = getByTestId('checkbox-7') as HTMLInputElement;
    const moneyInput = getByTestId('input-7') as HTMLInputElement;

    expect(checkbox).toBeChecked();
    expect(moneyInput.value).toBe('');

    fireEvent.change(moneyInput, { target: { value: '100' } });
    expect(moneyInput.value).toBe('100');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(moneyInput.value).toBe('');
  });

  it('renders checkbox question correctly with provided props', () => {
    const updatedProps = {
      ...props,
      currentStep: 2,
    };
    const { getByText, getByLabelText, getByTestId } = render(
      <Questions {...updatedProps} />,
    );

    expect(getByText('Question 2')).toBeInTheDocument();
    expect(getByLabelText('Option 1')).toBeInTheDocument();
    expect(getByLabelText('Option 2')).toBeInTheDocument();
    expect(getByLabelText('Option 3')).toBeInTheDocument();

    const checkOne = getByTestId('option-0');
    const checkTwo = getByTestId('option-1');
    const checkThree = getByTestId('option-2');
    fireEvent.click(checkOne);
    fireEvent.click(checkTwo);
    expect(checkOne).toBeChecked();
    expect(checkTwo).toBeChecked();

    fireEvent.click(checkThree);
    expect(checkOne).not.toBeChecked();
    expect(checkTwo).not.toBeChecked();
    expect(checkThree).toBeChecked();
  });

  it('renders input question correctly with provided props', () => {
    const updatedProps = {
      ...props,
      currentStep: 3,
    };
    const { getByTestId } = render(<Questions {...updatedProps} />);

    const moneyInput = getByTestId(`input-3`) as HTMLInputElement;
    fireEvent.change(moneyInput, { target: { value: '100' } });
    expect(moneyInput.value).toBe('100');
  });

  it('should render error message when there is an error', () => {
    mockErrors.forEach((error, index) => {
      const currentStep = index + 1;
      const storedData = { error: `q-${currentStep}` };

      const updatedProps = {
        ...props,
        errors: mockErrors,
        currentStep: currentStep,
        storedData: storedData,
      };

      const { getByTestId } = render(<Questions {...updatedProps} />);
      expect(getByTestId(`error-${currentStep}`)).toBeInTheDocument();

      const errorMessage = getByTestId(`errorMessage-${currentStep}`);
      expect(errorMessage.textContent).toBe(error.message);
    });
  });

  it('renders radio question correctly using value instead of index', () => {
    const questions = [
      {
        questionNbr: 1,
        title: 'Question 1',
        group: 'Group 1',
        type: 'single',
        answers: [
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
        ],
      },
      {
        questionNbr: 2,
        title: 'Question 2',
        group: 'Group 2',
        type: 'multiple',
        answers: [
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
          { text: 'Option 3', value: 'option3' },
        ],
      },
    ];

    const updatedProps = createPropsWithQuestions(questions);

    const { getByTestId } = render(<Questions {...updatedProps} />);

    expect(getByTestId('radio-input-0')).toHaveAttribute('value', 'option1');
    expect(getByTestId('radio-input-1')).toHaveAttribute('value', 'option2');

    const radioButton = getByTestId('radio-input-0');
    fireEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  });
  it('renders text input correctly', () => {
    const questions = [createQuestion()];
    const props = createPropsWithQuestions(questions);
    const { getByTestId } = render(<Questions {...props} />);
    expect(getByTestId('q-1')).toBeInTheDocument();
  });

  it('renders correct if a question has no valid type', () => {
    const questions = [createQuestion({ type: 'test', subType: 'test' })];
    const props = createPropsWithQuestions(questions);
    const { queryByTestId } = render(<Questions {...props} />);

    expect(queryByTestId('q-1')).toBeNull();
  });

  it('analytics data gets handled', () => {
    const questions = [
      {
        questionNbr: 1,
        title: 'Question 1',
        group: 'Group 1',
        type: 'single',
        subType: 'text',
        answers: [],
      },
    ];

    const updatedProps = {
      ...props,
      useValue: true,
      questions,
      analyticsData: {
        pageName: 'test',
        pageTitle: 'test',
        toolName: 'test',
        stepNames: ['test'],
        categoryLevels: ['test'],
      },
    };

    render(<Questions {...updatedProps} />);

    expect(addStepPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pageName: 'test',
        pageTitle: 'test',
        toolName: 'test',
        stepNames: ['test'],
        categoryLevels: ['test'],
      }),
      1,
    );
  });

  it('renders inputFrequency subtype', () => {
    const questions = [
      {
        questionNbr: 1,
        title: 'Question 1',
        group: 'Group 1',
        type: 'moneyInput',
        subType: 'inputFrequency',
        answers: [{ text: 'option1', value: '0' }],
      },
    ];

    const updatedProps = createPropsWithQuestions(questions);

    const { getByTestId } = render(<Questions {...updatedProps} />);

    expect(getByTestId('money-input')).toBeInTheDocument();
  });

  it('renders date type', () => {
    const questions = [createQuestion({ type: 'date', subType: '' })];
    const props = createPropsWithQuestions(questions);
    const { getByTestId } = render(<Questions {...props} />);
    expect(getByTestId('date-field')).toBeInTheDocument();
  });

  it('renders question callout', () => {
    const questions = [createQuestion({ calloutData: <h1>Callout</h1> })];
    const props = createPropsWithQuestions(questions);
    const { getByText } = render(<Questions {...props} />);
    expect(getByText('Callout')).toBeInTheDocument();
  });

  it('returns the correct error message for a matching question', () => {
    const mockErrors = [{ question: 1, message: 'Error for Q1' }];

    const displayError = (questionNumber: number, order = false) => {
      const errorObject =
        mockErrors.find((error) => error.question === questionNumber) ||
        mockErrors.find((error) => error.question === 0);

      return (
        <div
          className={twMerge('mb-4 text-red-700', order && ['order-2', 'mb-0'])}
          data-testid="errorMessage-1"
        >
          {errorObject?.message}
        </div>
      );
    };

    const { getByTestId } = render(displayError(1));
    const errorMessage = getByTestId('errorMessage-1');
    expect(errorMessage).toHaveTextContent('Error for Q1');
    expect(errorMessage).not.toHaveTextContent('Fallback error');
  });

  it('returns the fallback error message when specific question error is not found', () => {
    const mockErrors = [{ question: 0, message: 'Fallback error' }];

    const displayError = (
      questionNumber: number,
      errors: { question: number; message: string }[],
    ) => {
      const errorObject =
        errors.find((error) => error.question === questionNumber) ||
        errors.find((error) => error.question === 0);

      return errorObject ? (
        <div data-testid={`errorMessage-${questionNumber}`}>
          {errorObject.message}
        </div>
      ) : null;
    };

    const { getByTestId } = render(displayError(99, mockErrors));
    expect(getByTestId('errorMessage-99')).toHaveTextContent('Fallback error');
    expect(getByTestId('errorMessage-99')).not.toHaveTextContent(
      'Error for Q1',
    );
  });

  it('renders question definition, description, and question number', () => {
    const questions = [
      {
        questionNbr: 1,
        title: 'Question with everything',
        group: 'Group 1',
        type: 'single',
        definition: 'Helpful definition.',
        description: 'Helpful description.',
        answers: [
          { text: 'Option A', value: 'A' },
          { text: 'Option B', value: 'B' },
        ],
      },
    ];

    const updatedProps = {
      ...props,
      questions,
      currentStep: 1,
      displayQuestionNumber: true,
    };

    render(<Questions {...updatedProps} />);

    expect(screen.getByText('Helpful definition.')).toBeInTheDocument();
    expect(screen.getByText('Helpful description.')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
  });
});
