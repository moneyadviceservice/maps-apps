import { DataFromQuery } from '../pageFilter';
import {
  checkCondition,
  checkMultipleConditions,
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

describe('checkCondition arithmetic operators', () => {
  const numberData: DataFromQuery = {
    'q-1': '10',
  };

  it.each`
    description                                            | conditions                                                     | expected
    ${'returns true when value is greater than threshold'} | ${[{ question: '1', answer: '5', arithmeticOperator: '>' }]}   | ${true}
    ${'returns true when value is less than threshold'}    | ${[{ question: '1', answer: '15', arithmeticOperator: '<' }]}  | ${true}
    ${'returns true when value is greater than or equal'}  | ${[{ question: '1', answer: '10', arithmeticOperator: '>=' }]} | ${true}
    ${'returns true when value is less than or equal'}     | ${[{ question: '1', answer: '10', arithmeticOperator: '<=' }]} | ${true}
    ${'returns false when value does not meet operator'}   | ${[{ question: '1', answer: '20', arithmeticOperator: '>' }]}  | ${false}
  `('$description', ({ conditions, expected }) => {
    expect(checkCondition(conditions, numberData)).toBe(expected);
  });
});

describe('checkMultipleConditions', () => {
  const questionData: DataFromQuery = {
    'q-1': '0,1,2',
    'q-2': '0,1,2',
    'q-3': '1',
  };

  const numberInputData: DataFromQuery = {
    'q-1': '9000',
    'q-2': '1',
    'q-3': '2',
  };

  it('returns true if any group has all its conditions met', () => {
    const groups = [
      [
        { question: '1', answer: '3' }, // group 1 fails
        { question: '2', answer: '1' },
      ],
      [
        { question: '1', answer: '0' }, // group 2 passes
        { question: '3', answer: '1' },
      ],
    ].map((conds) => ({ conditions: conds }));

    expect(checkMultipleConditions(groups, questionData)).toBe(true);
  });

  it('returns false if no group has all its conditions met', () => {
    const groups = [
      [
        { question: '1', answer: '3' },
        { question: '2', answer: '1' },
      ],
      [
        { question: '1', answer: '2' },
        { question: '3', answer: '0' },
      ],
    ].map((conds) => ({ conditions: conds }));

    expect(checkMultipleConditions(groups, questionData)).toBe(false);
  });

  it('works with numeric conditions', () => {
    const groups = [
      [
        { question: '1', answer: '10000', arithmeticOperator: '<' },
        { question: '2', answer: '!2' },
        { question: '3', answer: '2' },
      ],
    ].map((conds) => ({ conditions: conds }));

    expect(checkMultipleConditions(groups, numberInputData)).toBe(true);
  });

  it('works with negated conditions', () => {
    const groups = [
      [
        { question: '1', answer: '!1' },
        { question: '2', answer: '0' },
      ],
    ].map((conds) => ({ conditions: conds }));

    expect(checkMultipleConditions(groups, questionData)).toBe(false);
  });
});
