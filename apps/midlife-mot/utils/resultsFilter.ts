import { Links } from 'types';

import { Answer, Question } from '@maps-react/form/types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

export const QUESTION_PREFIX = 'q-';
export const SCORE_PREFIX = 'score-q-';

interface DisplayGroup {
  links: Links[];
  score: number;
}

const resultsFilter = (qts: Question[], savedData: DataFromQuery) => {
  const removeDublicates = (array: Links[]): Links[] => {
    return array?.reduce(
      (unique: Links[], item: Links) =>
        unique.some((t) => t.link === item.link) ? unique : [...unique, item],
      [],
    );
  };

  const filterGroupData = () => {
    const dipslayGroups: Record<string, DisplayGroup> = {};

    /** Loop through the data (questions) then find the correct links
     *  if single answer add links of the answer to the list
     *
     * if multiple answers then find all checked answers with score 2 or unchecked answers with score 2 and
     * add them to the list.
     *
     * then compare scores for each group and assign the minimum score
     */

    const updateDisplayGroups = (
      question: Question,
      questionLinks: Links[],
      currentScore: number,
    ) => {
      const existingGroup = dipslayGroups[question.group];

      if (existingGroup) {
        existingGroup.links = [...existingGroup.links, ...questionLinks];
        existingGroup.score = Math.min(existingGroup.score, currentScore);
      } else {
        dipslayGroups[question.group] = {
          links: questionLinks,
          score: currentScore,
        };
      }
    };

    const getQuestionLinksForSingleType = (
      question: Question,
      answer: string,
    ) => {
      return question.answers[Number(answer)]?.links || [];
    };

    const getQuestionLinksForMultipleType = (
      question: Question,
      answer: string,
    ): Links[] => {
      const answerToArray = answer.split(',');
      const isClearAllOptionSelected = isClearAllSelected(
        answerToArray,
        question,
      );

      return question.answers.reduce((questionLinks, elem, index) => {
        const isAnswerSelected = isSelected(answerToArray, index);

        if (shouldAddLinks(isAnswerSelected, elem, isClearAllOptionSelected)) {
          questionLinks = addLinks(questionLinks, elem.links || []);
        }

        if (!isAnswerSelected && elem.unselectedAnswerLinks) {
          questionLinks = addLinks(
            questionLinks,
            elem.unselectedAnswerLinks || [],
          );
        }

        return questionLinks;
      }, [] as Links[]);
    };

    const isClearAllSelected = (
      answerToArray: string[],
      question: Question,
    ): boolean => {
      return answerToArray.some((t) => question.answers[Number(t)].clearAll);
    };

    const isSelected = (answerToArray: string[], index: number): boolean => {
      return answerToArray.some((t) => Number(t) === index);
    };

    const shouldAddLinks = (
      isAnswerSelected: boolean,
      elem: Answer,
      isClearAllOptionSelected: boolean,
    ): boolean => {
      return (
        (isAnswerSelected && elem.showLinksIfSelected) ||
        (!isAnswerSelected &&
          !elem.showLinksIfSelected &&
          !isClearAllOptionSelected)
      );
    };

    const addLinks = (questionLinks: Links[], links: Links[]): Links[] => {
      return [...questionLinks, ...links];
    };

    const handleQuestionLinks = (
      question: Question,
      currentScore: number,
      answer: string,
    ) => {
      let questionLinks: Links[] = [];

      if (question.type === 'single') {
        questionLinks = getQuestionLinksForSingleType(question, answer);
      } else if (question.type === 'multiple') {
        questionLinks = getQuestionLinksForMultipleType(question, answer);
      }

      if (currentScore && answer) {
        updateDisplayGroups(question, questionLinks, currentScore);
      }
    };

    const processQuestions = (qts: Question[], savedData: DataFromQuery) => {
      qts.forEach((question) => {
        const currentScore = Number(
          savedData[SCORE_PREFIX + question.questionNbr],
        );
        const answer = savedData[QUESTION_PREFIX + question.questionNbr];

        if (currentScore && answer) {
          handleQuestionLinks(question, currentScore, answer);
        }
      });
    };

    processQuestions(qts, savedData);

    /* Remove dublicate links */
    Object.keys(dipslayGroups).forEach((t) => {
      dipslayGroups[t].links = removeDublicates(dipslayGroups[t].links);
    });

    return {
      highRiskGroup: Object.keys(dipslayGroups).reduce((accumulator, elem) => {
        return dipslayGroups[elem].score > 0 && dipslayGroups[elem].score < 1.99
          ? Object.assign(accumulator, { [elem]: dipslayGroups[elem] })
          : accumulator;
      }, {}),

      mediumRiskGroup: Object.keys(dipslayGroups).reduce(
        (accumulator, elem) =>
          dipslayGroups[elem].score > 1.99 && dipslayGroups[elem].score < 2.99
            ? Object.assign(accumulator, { [elem]: dipslayGroups[elem] })
            : accumulator,
        {},
      ),

      lowRiskGroup: Object.keys(dipslayGroups).reduce(
        (accumulator, elem) =>
          dipslayGroups[elem].score > 2.99 && dipslayGroups[elem].score < 3.99
            ? Object.assign(accumulator, { [elem]: dipslayGroups[elem] })
            : accumulator,
        {},
      ),
    };
  };

  return {
    filterGroupData,
  };
};

export default resultsFilter;
