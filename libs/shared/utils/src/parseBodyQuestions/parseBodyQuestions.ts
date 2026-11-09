import type { NextApiRequest } from 'next';

const SCORE_PREFIX = 'score-q-';

/**
 * Turns the POST body of a step-tool question form into the data to store for
 * that question, e.g. when a user submits an answer, this builds the query
 * data that is carried to the next question.
 *
 * Behaviour depends on `body.type`:
 * - `single`: stores `answer` under the question key, merged with `savedData`
 *   (JSON of earlier answers). If `score` is supplied, also stores
 *   `score-q-<n>` using the score for the chosen option. Missing answer = error.
 * - `multiple`: see `parseBodyMultiQuestions`.
 * - `moneyInput`: strips commas and prefixes `£`, e.g. '1,500' -> '£1500'.
 * - anything else, or an empty answer: `error: true`.
 *
 * @example single
 * body: { type: 'single', question: 'q-4', answer: '1', score: { 1: 7 },
 *         savedData: '{"q-1":"0"}' }
 * returns: { data: { 'q-1': '0', 'q-4': '1', 'score-q-4': 7 },
 *            questionNumber: 4, error: false }
 *
 * @example multiple
 * body: { type: 'multiple', question: 'q-5', answer0: '0', answer1: '2',
 *         score: { 0: '5', 2: '3' }, unselectedScore: { 0: '9', 2: '8', 3: '1' },
 *         clearAll: { 0: 'false', 2: 'false' } }
 * returns: { data: { 'q-5': '0,2', 'score-q-5': 1 }, questionNumber: 5, error: false }
 */
export const parseBodyQuestions = (response: NextApiRequest) => {
  const { score, question, type, answer, savedData } = response.body;
  const questionNumber = Number(question?.split('-')[1]);
  const questionScore = SCORE_PREFIX + questionNumber;

  let error = false;
  let data = {};

  switch (type) {
    case 'single':
      if (answer) {
        data = {
          ...(savedData && JSON.parse(savedData)),
          [question]: answer,
          ...(score && { [questionScore]: score[Number(answer)] }),
        };
      } else {
        data = {
          ...(savedData && JSON.parse(savedData)),
          [question]: answer,
        };
        error = true;
      }
      break;

    case 'multiple':
      ({ data, error } = parseBodyMultiQuestions(
        response,
        savedData ? JSON.parse(savedData) : {},
      ));
      break;

    case 'moneyInput':
      if (answer) {
        data = {
          ...data,
          [question]: `£${answer.replace(/,/g, '')}`,
        };
      } else {
        error = true;
      }
      break;

    default:
      error = true;
  }

  return { data, questionNumber, error };
};

/**
 * Handles checkbox (multi-select) questions.
 *
 * - Selected values are read from every body key containing 'answer'
 *   (e.g. `answer0`, `answer1`); each may be a string or an array of strings.
 * - They are stored as a comma separated string, e.g. '0,2'.
 * - `clearAll[value] === 'true'` marks an exclusive option such as
 *   "None of the above": it replaces the answers collected so far.
 * - `score` and `unselectedScore` (arrays or index-keyed objects) produce a
 *   single `score-q-<n>`: the lowest score among the selected options, lowered
 *   further by any unselected option with a lower non-zero score (only applied
 *   when the selected score is above 1).
 * - No answers selected = `error: true`.
 *
 * Note: when `unselectedScore` is an object, the selected keys are deleted
 * from it as they are processed.
 */
function parseBodyMultiQuestions(
  response: NextApiRequest,
  data: Record<string, string | number>,
) {
  const { score, unselectedScore, question, clearAll } = response.body;
  const questionNumber = Number(question?.split('-')[1]);
  const questionScore = SCORE_PREFIX + questionNumber;
  let error = false;
  let an = '';
  let totalScore = 0;

  const getIndexedValue = (
    indexedField: unknown,
    index: string,
  ): string | undefined => {
    if (Array.isArray(indexedField)) {
      return indexedField[Number(index)]?.toString();
    }

    if (indexedField && typeof indexedField === 'object') {
      return (indexedField as Record<string, unknown>)[index]?.toString();
    }

    return undefined;
  };

  const selectedAnswers = Object.keys(response.body)
    .filter((key) => key.includes('answer'))
    .flatMap((key) => {
      const value = response.body[key];

      if (Array.isArray(value)) {
        return value.map((item) => item?.toString()).filter(Boolean);
      }

      return value ? [value.toString()] : [];
    });

  selectedAnswers.forEach((selectedAnswer) => {
    if (score) {
      const sc = Number(getIndexedValue(score, selectedAnswer));

      if (!Number.isNaN(sc)) {
        totalScore = totalScore === 0 || totalScore > sc ? sc : totalScore;
      }
    }

    const answers = an.length > 0 ? ',' + selectedAnswer : selectedAnswer;
    const isClearAllSelection =
      getIndexedValue(clearAll, selectedAnswer) === 'true';

    an = isClearAllSelection ? selectedAnswer : an.concat(answers);

    if (unselectedScore && typeof unselectedScore === 'object') {
      delete (unselectedScore as Record<string, unknown>)[selectedAnswer];
    }
  });

  if (an.length > 0) {
    if (totalScore > 1) {
      const remainingUnselectedScores = Array.isArray(unselectedScore)
        ? unselectedScore
        : unselectedScore && typeof unselectedScore === 'object'
        ? Object.values(unselectedScore)
        : [];

      remainingUnselectedScores.forEach((element: string | string[]) => {
        const s = element.length > 0 ? Number(element) : null;
        const sc = s && s < totalScore ? s : totalScore;
        totalScore = s ? sc : totalScore;
      });
    }

    data = {
      ...data,
      [question]: an,
      ...(score && { [questionScore]: Math.max(totalScore, 0) }),
    };
  } else {
    error = true;
  }

  return {
    data,
    questionNumber,
    error,
  };
}
