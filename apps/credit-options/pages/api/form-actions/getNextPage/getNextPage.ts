const getChangeOptionsPage = () => '/change-options';

const getTargetPage = (target: string) => target;

const getNextQuestionPage = (questionNumber: number) =>
  `/question-${questionNumber + 1}`;

export const getNextPage = (
  questionNumber: number,
  isAnswerChanged: boolean,
  target: string,
): string => {
  if (isAnswerChanged) {
    return getChangeOptionsPage();
  }

  if (target.length > 0) {
    return getTargetPage(target);
  }

  return getNextQuestionPage(questionNumber);
};
