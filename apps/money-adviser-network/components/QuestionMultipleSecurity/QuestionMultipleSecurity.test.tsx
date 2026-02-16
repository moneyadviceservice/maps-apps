import { fireEvent, render } from '@testing-library/react';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { QuestionMultipleSecurity } from './QuestionMultipleSecurity';

import '@testing-library/jest-dom/extend-expect';

const questionMock = {
  questionNbr: 5,
  group: '',
  title: 'Security questions',
  description:
    "The debt adviser will use these questions to verify your customer's identity. Please ask your customer to provide their postcode and to answer one of the security questions.",
  type: 'security',
  subType: '',
  classes: ['text-[18px]'],
  answers: [
    { text: 'In what city were you born?', value: 'city' },
    { text: "What is your mother's maiden name?", value: 'maiden' },
    { text: 'What was the name of your first pet?', value: 'pet' },
    { text: 'What was the name of your first school?', value: 'school' },
  ],
};

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
    events: { on: jest.fn(), off: jest.fn() },
  }),
}));

describe('QuestionMultipleSecurity Component', () => {
  it('renders without crashing', () => {
    const { container, getByText, getByLabelText } = render(
      <QuestionMultipleSecurity
        question={questionMock}
        cookieData={{} as CookieData['securityQuestions']}
        errors={[]}
      />,
    );

    expect(getByText(questionMock.description)).toBeInTheDocument();
    expect(getByLabelText("Customer's postcode")).toBeInTheDocument();
    expect(getByLabelText('Security question')).toBeInTheDocument();
    expect(getByLabelText('Answer to security question')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const errors = [
      { question: FORM_FIELDS.postcode, message: 'Invalid postcode' },
      { question: FORM_FIELDS.securityQuestion, message: 'Select a question' },
      { question: FORM_FIELDS.securityAnswer, message: 'Answer required' },
    ];

    const { getByText } = render(
      <QuestionMultipleSecurity
        question={questionMock}
        cookieData={{} as CookieData['securityQuestions']}
        errors={errors}
      />,
    );

    expect(getByText('Invalid postcode')).toBeInTheDocument();
    expect(getByText('Select a question')).toBeInTheDocument();
    expect(getByText('Answer required')).toBeInTheDocument();
  });

  it('clears answer input when security question changes', async () => {
    const { getByTestId } = render(
      <QuestionMultipleSecurity
        question={questionMock}
        cookieData={
          {
            [FORM_FIELDS.securityAnswer]: 'oldAnswer',
          } as CookieData['securityQuestions']
        }
        errors={[]}
      />,
    );

    const select = getByTestId('security-question-select');
    const answerInput = getByTestId('security-answer-input');

    expect(answerInput).toHaveValue('oldAnswer');

    fireEvent.change(select, {
      target: { value: 'school' },
    });

    expect(getByTestId('security-answer-input')).toHaveValue('');
  });

  it('renders default cookieData values', () => {
    const { getByTestId } = render(
      <QuestionMultipleSecurity
        question={questionMock}
        cookieData={
          {
            [FORM_FIELDS.postcode]: 'AB12 3CD',
            [FORM_FIELDS.securityQuestion]: 'city',
            [FORM_FIELDS.securityAnswer]: 'London',
          } as CookieData['securityQuestions']
        }
        errors={[]}
      />,
    );

    expect(getByTestId('postcode-input')).toHaveValue('AB12 3CD');
    expect(getByTestId('security-question-select')).toHaveValue('city');
    expect(getByTestId('security-answer-input')).toHaveValue('London');
  });
});
