import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ChangeAnswers } from './ChangeAnswers';
import { DataPath } from 'types';

jest.mock('@maps-digital/shared/hooks', () => ({
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
      questionNbr: 1,
      group: 'Group 1',
      title: 'Question 1',
      type: 'text',
      answers: [{ text: 'Answer 1', clearAll: false }],
    },
    {
      questionNbr: 2,
      group: 'Group 2',
      title: 'Question 2',
      type: 'text',
      answers: [{ text: 'Answer 2', clearAll: false }],
    },
  ];
  const dataPath = DataPath.MidLifeMot;
  const text = 'Test text';
  const nextLink = '/next';
  const actionText = 'Next';
  const CHANGE_ANSWER_API = '/change-answer';
  const backLink = '/back';
  const lang = 'en';
  const isEmbed = false;

  it('renders the component with provided props', () => {
    const { getByText, getByTestId } = render(
      <ChangeAnswers
        storedData={storedData}
        data={data}
        questions={questions}
        dataPath={dataPath}
        text={text}
        nextLink={nextLink}
        actionText={actionText}
        CHANGE_ANSWER_API={CHANGE_ANSWER_API}
        backLink={backLink}
        lang={lang}
        isEmbed={isEmbed}
      />,
    );

    expect(getByText(text)).toBeInTheDocument();

    questions.forEach((question, index) => {
      const questionTitle = getByTestId(`q-${question.questionNbr}`);
      expect(questionTitle).toBeInTheDocument();
      expect(questionTitle.textContent).toBe(question.title);
      expect(getByTestId(`change-answer-${index}`)).toBeInTheDocument();
    });
  });
});
