import { render } from '@testing-library/react';

import { FLOW } from '../../utils/getQuestions';
import { ChangeAnswers } from './ChangeAnswers';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: () => 'Change' }),
}));

describe('ChangeAnswers Component', () => {
  const storedData = {
    'q-1': '1,2,3',
    'q-2': '0,1',
  };
  const data = '';
  const questions = [
    {
      question: 'Question 1',
      answer: 'Answer 1',
      flow: FLOW.START,
      questionNbr: 1,
    },
    {
      question: 'Question 2',
      answer: 'Answer 2',
      flow: FLOW.START,
      questionNbr: 2,
    },
  ];
  const text = 'Test text';
  const actionText = 'Next';
  const CHANGE_ANSWER_API = '/change-answer';
  const SUBMIT_API = '/submit-api';
  const backLink = '/back';
  const lang = 'en';
  const currentFlow = FLOW.START;

  it('renders the component with provided props', () => {
    const { getByText, getByTestId, container } = render(
      <ChangeAnswers
        storedData={storedData}
        urlData={data}
        cookieData={''}
        questions={questions}
        text={text}
        actionText={actionText}
        CHANGE_ANSWER_API={CHANGE_ANSWER_API}
        backLink={backLink}
        lang={lang}
        currentFlow={currentFlow}
        SUBMIT_API={SUBMIT_API}
      />,
    );

    expect(getByText(text)).toBeInTheDocument();

    questions.forEach(({ questionNbr, question, answer }) => {
      const questionTitle = getByTestId(`q-${questionNbr}`);
      expect(questionTitle).toBeInTheDocument();
      expect(questionTitle.textContent).toBe(question);
      expect(questionTitle).toHaveAttribute('id', `q-${questionNbr}`);

      const answerText = getByTestId(`a-${questionNbr}`);
      expect(answerText).toBeInTheDocument();
      expect(answerText.textContent).toBe(answer);

      const changeAnswer = getByTestId(`change-question-${questionNbr}`);
      expect(changeAnswer).toBeInTheDocument();
      expect(changeAnswer).toHaveValue(`${questionNbr}`);

      const urlData = getByTestId(`urlData-${questionNbr}`);
      expect(urlData).toBeInTheDocument();
      expect(urlData).toHaveAttribute('type', 'hidden');

      const language = getByTestId(`language-${questionNbr}`);
      expect(language).toBeInTheDocument();
      expect(language).toHaveAttribute('type', 'hidden');

      const pagePath = getByTestId(`pagePath-${questionNbr}`);
      expect(pagePath).toBeInTheDocument();
      expect(pagePath).toHaveAttribute('type', 'hidden');
      expect(pagePath).toHaveValue(`start/q-${questionNbr}`);

      const prefix = getByTestId(`prefix-${questionNbr}`);
      expect(prefix).toHaveValue(`q-`);
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders warning message when on the telephone flow with immediate callback scheduled', () => {
    const sData = { ...storedData, ...{ whenToSpeak: { value: 0 } } };

    const { getByTestId, container } = render(
      <ChangeAnswers
        storedData={sData}
        urlData={data}
        cookieData={''}
        questions={questions}
        text={text}
        actionText={actionText}
        CHANGE_ANSWER_API={CHANGE_ANSWER_API}
        backLink={backLink}
        lang={lang}
        currentFlow={FLOW.TELEPHONE}
        SUBMIT_API={SUBMIT_API}
        displayImmediateCallbackNotification={true}
      />,
    );

    const confirmWarning = getByTestId(
      `callout-warning-telephone-confirm-warning`,
    );
    expect(confirmWarning).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});
