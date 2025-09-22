import { DataFromQuery } from '../pageFilter';
import {
  checkCondition,
  checkSomeCondition,
  Condition,
} from './checkCondition';

type TestTypes = {
  conditions: Condition[];
  testQuestionData: DataFromQuery;
  expectedResult: boolean;
};

describe('checkCondition', () => {
  const questionData = {
    'q-1': '0,1,2',
    'q-2': '0,1,2',
    'q-3': '1',
  };

  const orOpertorData = { 'q-1': '2', 'q-2': '0' };

  const numberInputQuestionData = {
    'q-1': '9000',
    'q-2': '1',
    'q-3': '2',
  };

  const numberInputQuestionDataPoundSign = {
    'q-1': '£9000',
    'q-2': '1',
    'q-3': '2',
  };

  const numberInputMoreThan = {
    'q-1': '10000',
    'q-2': '1',
    'q-3': '2',
  };

  it.each`
    description                                                                 | conditions                                                                                                                        | testQuestionData                    | expectedResult
    ${'returns true if the condition matches the single answer'}                | ${[{ question: '1', answer: '0' }]}                                                                                               | ${questionData}                     | ${true}
    ${'returns true if the condition matches another single answer'}            | ${[{ question: '3', answer: '1' }]}                                                                                               | ${questionData}                     | ${true}
    ${'returns true if the last of the multiple answers exists'}                | ${[{ question: '1', answer: '2' }]}                                                                                               | ${questionData}                     | ${true}
    ${'returns true if multiple conditions are met'}                            | ${[{ question: '1', answer: '1' }, { question: '3', answer: '1' }]}                                                               | ${questionData}                     | ${true}
    ${'returns true when checking numberInput condition'}                       | ${[{ question: '1', answer: '10000', arithmeticOperator: '<' }, { question: '2', answer: '!2' }, { question: '3', answer: '2' }]} | ${numberInputQuestionData}          | ${true}
    ${'returns true when checking numberInput condition includes a pound sign'} | ${[{ question: '1', answer: '10000', arithmeticOperator: '<' }, { question: '2', answer: '!2' }, { question: '3', answer: '2' }]} | ${numberInputQuestionDataPoundSign} | ${true}
    ${'returns false if the condition does not match the answer'}               | ${[{ question: '3', answer: '0' }]}                                                                                               | ${questionData}                     | ${false}
    ${'returns false if the negated condition does match the answer'}           | ${[{ question: '1', answer: '!1' }]}                                                                                              | ${questionData}                     | ${false}
    ${'returns false if the question exists but the answer does not'}           | ${[{ question: '3', answer: '2' }]}                                                                                               | ${questionData}                     | ${false}
    ${'returns false if the condition does not match the single answer'}        | ${[{ question: '3', answer: '0' }]}                                                                                               | ${questionData}                     | ${false}
    ${'returns false when just some conditions pass'}                           | ${[{ question: '1', answer: '1' }, { question: '3', answer: '2' }]}                                                               | ${questionData}                     | ${false}
    ${'returns false when numberInput is more than the expected value'}         | ${[{ question: '1', answer: '10000', arithmeticOperator: '<' }, { question: '2', answer: '!2' }, { question: '3', answer: '2' }]} | ${numberInputMoreThan}              | ${false}
  `(
    '$description',
    ({ conditions, testQuestionData, expectedResult }: TestTypes) => {
      const actual = checkCondition(conditions, testQuestionData);
      expect(actual).toBe(expectedResult);
    },
  );

  it.each`
    description                                                              | conditions                                                          | testQuestionData | expectedResult
    ${'returns true if any of the conditions match when passing any flag'}   | ${[{ question: '1', answer: '1' }, { question: '3', answer: '0' }]} | ${questionData}  | ${true}
    ${'returns true if any conditions match when passing any flag'}          | ${[{ question: '2', answer: '0' }, { question: '4', answer: '0' }]} | ${orOpertorData} | ${true}
    ${'returns false if none of the conditions match when passing any flag'} | ${[{ question: '1', answer: '3' }, { question: '4', answer: '2' }]} | ${questionData}  | ${false}
  `(
    '$description',
    ({ conditions, testQuestionData, expectedResult }: TestTypes) => {
      const actual = checkSomeCondition(conditions, testQuestionData);
      expect(actual).toBe(expectedResult);
    },
  );
});
