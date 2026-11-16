import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { Question } from '../../types';
import { GridStepContainer, Layout } from '../GridStepContainer';
import { StepContainer } from '../StepContainer';

type Props = {
  storedData: DataFromQuery;
  data: string;
  questions: Question[];
  dataPath?: string;
  text: string;
  nextLink: string;
  actionText: string;
  CHANGE_ANSWER_API: string;
  backLink: string;
  lang: string;
  isEmbed: boolean;
  enableFullPageLoad?: boolean;
  glassBoxQuestions?: number[];
  layout?: Layout;
};

export const renderMoneyInput = (question: Question, storedValue: string) => {
  if (question.subType === 'inputFrequency') {
    const frequencySplitIndex = storedValue.lastIndexOf(',');
    const income = storedValue.substring(0, frequencySplitIndex);
    const frequency = Number(storedValue.substring(frequencySplitIndex + 1));
    return (
      <span
        key={question.questionNbr}
        data-testid={`answer-${question.questionNbr}`}
      >
        £{income} {question.answers[frequency]?.text}
      </span>
    );
  }

  if (question.subType === 'inputCheckbox') {
    const valueSplitIndex = storedValue.lastIndexOf(',');
    const checkboxValue = Number(storedValue.substring(valueSplitIndex + 1));
    return storedValue === ',1' ? (
      <span>{question.answers[checkboxValue - 1]?.text}</span>
    ) : (
      <span>£{storedValue}</span>
    );
  }

  return storedValue;
};

export const renderDate = (question: Question, storedValue: string) => {
  const dateParts = storedValue.split('-');
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (question.questionNbr === 2 && dateParts.length === 3) {
    const [day, monthStr, year] = dateParts;
    const month = Number.parseInt(monthStr, 10);
    const monthName = monthNames[month - 1] || '';
    return `${day} ${monthName} ${year}`;
  }

  if (dateParts.length === 2) {
    const [monthStr, year] = dateParts;
    const month = Number.parseInt(monthStr, 10);
    const monthName = monthNames[month - 1] || '';
    return `${monthName} ${year}`;
  }

  return storedValue;
};

export const ChangeAnswers = ({
  storedData,
  data,
  questions,
  dataPath,
  text,
  nextLink,
  actionText,
  CHANGE_ANSWER_API,
  backLink,
  lang,
  isEmbed,
  enableFullPageLoad = false,
  glassBoxQuestions = [],
  layout = 'default',
}: Props) => {
  const QUESTION_PREFIX = 'q-';
  const { z } = useTranslation();

  const getStoredValue = (question: Question, storedData: DataFromQuery) => {
    return storedData[QUESTION_PREFIX + String(question.questionNbr)];
  };

  const renderDefault = (question: Question, answer: string[]) => {
    return answer.map((value, index) => {
      const answerIndex = Number.parseInt(value);
      return Number.isNaN(answerIndex) ? (
        <span key={index}></span>
      ) : (
        <span key={index}>
          {question.answers[answerIndex]?.text}
          <br />
        </span>
      );
    });
  };

  const renderAnswer = (
    question: Question,
    answer: string[],
    storedData: DataFromQuery,
  ) => {
    const storedValue = getStoredValue(question, storedData);

    switch (question.type) {
      case 'moneyInput':
        return renderMoneyInput(question, storedValue);
      case 'date':
        return renderDate(question, storedValue);
      default:
        return renderDefault(question, answer);
    }
  };

  const Container = layout === 'grid' ? GridStepContainer : StepContainer;

  return (
    <Container backLink={backLink} isEmbed={isEmbed}>
      <div
        className={`mt-10 space-y-10 ${
          layout === 'grid' ? '' : 'lg:max-w-[840px]'
        }`}
      >
        <div className="space-y-4">
          <H1>
            {z({ en: 'Check your answers', cy: 'Gwiriwch eich atebion' })}
          </H1>

          <Paragraph>{text}</Paragraph>

          <form method="POST">
            <input
              type="hidden"
              name="isEmbed"
              value={isEmbed ? 'true' : 'false'}
            />
            <input type="hidden" name="savedData" value={data} />
            <input type="hidden" name="language" value={lang} />
            <input type="hidden" name="dataPath" value={dataPath} />

            <dl className="pt-4 space-y-4">
              {questions.map((t) => {
                const savedAnswer: string[] =
                  storedData[QUESTION_PREFIX + String(t.questionNbr)]?.split(
                    ',',
                  );

                if (!savedAnswer) return null;

                return (
                  <div
                    key={`dl-question-${t.questionNbr}`}
                    className="grid items-start grid-cols-8 pb-2 mt-2 border-b gap-x-7 border-slate-400"
                  >
                    {/* Question */}
                    <dt
                      id={`q-${t.questionNbr}`}
                      className="col-span-3 font-bold md:text-lg lg:col-span-4"
                      data-testid={`q-${t.questionNbr}`}
                    >
                      {t.title}
                    </dt>

                    {/* Answer + Button in same DD */}
                    <dd className="flex items-start col-span-5 gap-4 lg:col-span-4">
                      <Paragraph
                        hasGlassBoxClass={glassBoxQuestions.includes(
                          t.questionNbr,
                        )}
                        testId={`answer-${t.questionNbr}`}
                        className="flex-1"
                      >
                        {renderAnswer(t, savedAnswer, storedData)}
                      </Paragraph>

                      <Button
                        className="flex-shrink-0 align-top"
                        variant="link"
                        formAction={CHANGE_ANSWER_API}
                        name="questionNbr"
                        value={t.questionNbr}
                        aria-describedby={`q-${t.questionNbr}`}
                        data-testid={`change-question-${t.questionNbr}`}
                      >
                        {z({ en: 'Change', cy: 'Newid' })}
                      </Button>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </form>
        </div>
        <div>
          {' '}
          {enableFullPageLoad ? (
            <Button
              as="a"
              href={nextLink}
              variant="primary"
              className="justify-center w-full md:w-auto md:justify-start"
              data-testid="next-page-button"
            >
              <span>{actionText}</span>
            </Button>
          ) : (
            <Link
              asButtonVariant="primary"
              href={nextLink}
              className="justify-center w-full md:w-auto md:justify-start"
              data-testid="next-page-button"
            >
              <span>{actionText}</span>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
};
