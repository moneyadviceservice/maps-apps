import React from 'react';

import { render, screen } from '@testing-library/react';

import { Question } from '../../types';
import { ChangeAnswers, renderDate, renderMoneyInput } from './ChangeAnswers';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: () => 'Change' }),
}));

describe('ChangeAnswers Component', () => {
  const storedData = {
    'q-1': '1,2,3',
    'q-2': '0,1',
    'q-3': '1234',
    'q-5': '2000,0',
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
    {
      questionNbr: 3,
      group: 'Group 3',
      title: 'Question 3',
      type: 'moneyInput',
      answers: [{ text: 'Answer 3', clearAll: false }],
    },
  ];
  const dataPath = 'test-path';
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

    questions.forEach((question) => {
      const questionTitle = getByTestId(`q-${question.questionNbr}`);
      expect(questionTitle).toBeInTheDocument();
      expect(questionTitle.textContent).toBe(question.title);
      expect(
        getByTestId(`change-question-${question.questionNbr}`),
      ).toBeInTheDocument();
    });
  });

  it("dosen't render an unsaved question", () => {
    const { getByText, queryByTestId } = render(
      <ChangeAnswers
        storedData={{}}
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

    questions.forEach((question) => {
      const questionTitle = queryByTestId(`q-${question.questionNbr}`);
      expect(questionTitle).toBeNull();
      expect(
        queryByTestId(`change-question-${question.questionNbr}`),
      ).toBeNull();
    });
  });
  it('should correctly render money input with income and frequency', () => {
    const storedValue = '2000,1';

    const question = {
      questionNbr: 5,
      group: 'Group 5',
      title: 'Question 5',
      type: 'text',
      subType: 'inputFrequency',
      answers: [{ text: 'Yearly' }, { text: 'Monthly' }, { text: 'Weekly' }],
    };

    const element = renderMoneyInput(question, storedValue);

    render(element);

    expect(screen.getByText('£2000 Monthly')).toBeInTheDocument();
  });

  it('renders raw value with £ when storedValue is not ",1"', () => {
    const question: Question = {
      questionNbr: 5,
      title: '',
      group: '',
      type: 'moneyInput',
      subType: 'inputCheckbox',
      answers: [{ text: 'Some checkbox label' }],
    };

    const { container } = render(
      renderMoneyInput(question, '500,1') as JSX.Element,
    );

    expect(container.textContent).toBe('£500,1');
  });

  it('safely handles missing answer text', () => {
    const question: Question = {
      questionNbr: 5,
      title: '',
      group: '',
      type: 'moneyInput',
      subType: 'inputCheckbox',
      answers: [], // no answers
    };

    const { container } = render(
      renderMoneyInput(question, ',1') as JSX.Element,
    );

    expect(container.textContent).toBe('');
  });

  it('should format full date when questionNbr is 2 and date has 3 parts', () => {
    const question: Question = {
      questionNbr: 2,
      group: '',
      title: '',
      type: 'date',
      answers: [],
    };
    const result = renderDate(question, '15-03-2024');
    expect(result).toBe('15 March 2024');
  });

  it('should format month and year when date has 2 parts', () => {
    const question: Question = {
      questionNbr: 3,
      group: '',
      title: '',
      type: 'date',
      answers: [],
    };
    const result = renderDate(question, '04-2025');
    expect(result).toBe('April 2025');
  });

  it('returns storedValue as-is when format is unrecognized', () => {
    const question: Question = {
      questionNbr: 5,
      title: '',
      group: '',
      type: 'date',
      answers: [],
    };

    const result = renderDate(question, '2025');
    expect(result).toBe('2025');
  });
});
