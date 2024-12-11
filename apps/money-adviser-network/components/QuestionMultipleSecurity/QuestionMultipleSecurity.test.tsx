import { render } from '@testing-library/react';

import { QuestionMultipleSecurity } from './QuestionMultipleSecurity';

import '@testing-library/jest-dom/extend-expect';
import { CookieData } from '../../data/questions/types';

const questionMock = {
  questionNbr: 5,
  group: '',
  title: 'Security questions',
  description:
    "The debt adviser will use these questions to verify your customer's identify. Please ask your customer to provide their postcode and to answer one of the security questions. ",
  type: 'security',
  subType: '',
  classes: ['text-[18px]'],
  answers: [
    { text: 'In what city were you born?', value: 'city' },
    { text: "What is your mother's maiden name?", value: 'maiden' },
    { text: "'What was the name of your first pet?", value: 'pet' },
    {
      text: 'What was the name of your first school?',
      value: 'school',
    },
  ],
};

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

describe('QuestionMultipleSecurity Component', () => {
  test('renders without crashing', () => {
    render(
      <QuestionMultipleSecurity
        question={questionMock}
        cookieData={{} as CookieData['securityQuestions']}
        errors={[]}
      />,
    );
  });
});
