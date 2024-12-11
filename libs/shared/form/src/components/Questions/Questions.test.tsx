import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { ErrorType } from '../../types';
import { Questions } from './Questions';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
  }),
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
];

const mockErrors = [
  { question: 1, message: 'Error message for question 1' },
  { question: 2, message: 'Error message for question 2' },
  { question: 3, message: 'Error message for question 3' },
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

describe('Questions Component', () => {
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

    const updatedProps = {
      ...props,
      useValue: true,
      questions,
    };

    const { getByTestId } = render(<Questions {...updatedProps} />);

    expect(getByTestId('radio-input-0')).toHaveAttribute('value', 'option1');
    expect(getByTestId('radio-input-1')).toHaveAttribute('value', 'option2');

    const radioButton = getByTestId('radio-input-0');
    fireEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  });
});
