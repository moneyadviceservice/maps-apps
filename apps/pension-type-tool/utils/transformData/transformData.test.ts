import { QUESTION_PREFIX } from 'utils/constants';
import { DataPath } from 'types';

import { transformData } from './transformData';

const defaultInputs = {
  error: false,
  navRules: {
    CONTINUE: true,
    skipQ2: false,
    skipQ3: false,
    skipQ4: false,
  },
  data: {
    [`${QUESTION_PREFIX}1`]: '0',
    [`${QUESTION_PREFIX}2`]: '1',
    [`${QUESTION_PREFIX}3`]: '2',
    [`${QUESTION_PREFIX}4`]: '3',
  },
  question: 'question-1',
  path: DataPath.PensionType,
};

describe('transformData', () => {
  it.each`
    description                                              | error                  | navRules                                       | data                  | question                  | path                  | expected
    ${'should return un-transformed data for error input'}   | ${true}                | ${defaultInputs.navRules}                      | ${defaultInputs.data} | ${defaultInputs.question} | ${defaultInputs.path} | ${{ 'q-1': '0', 'q-2': '1', 'q-3': '2', 'q-4': '3', error: 'question-1' }}
    ${'should transform data and skip Q2'}                   | ${defaultInputs.error} | ${{ ...defaultInputs.navRules, skipQ2: true }} | ${defaultInputs.data} | ${defaultInputs.question} | ${defaultInputs.path} | ${{ 'q-1': '0' }}
    ${'should transform data and skip Q3'}                   | ${defaultInputs.error} | ${{ ...defaultInputs.navRules, skipQ3: true }} | ${defaultInputs.data} | ${defaultInputs.question} | ${defaultInputs.path} | ${{ 'q-1': '0', 'q-2': '1' }}
    ${'should transform data and skip Q4'}                   | ${defaultInputs.error} | ${{ ...defaultInputs.navRules, skipQ4: true }} | ${defaultInputs.data} | ${defaultInputs.question} | ${defaultInputs.path} | ${{ 'q-1': '0', 'q-2': '1', 'q-3': '2' }}
    ${'should transform data without skipping'}              | ${defaultInputs.error} | ${defaultInputs.navRules}                      | ${defaultInputs.data} | ${defaultInputs.question} | ${defaultInputs.path} | ${{ 'q-1': '0', 'q-2': '1', 'q-3': '2', 'q-4': '3' }}
    ${'should return empty object for non-PensionType path'} | ${defaultInputs.error} | ${defaultInputs.navRules}                      | ${defaultInputs.data} | ${defaultInputs.question} | ${'invalid-path'}     | ${{}}
  `(
    '$path $description',
    ({ error, navRules, data, question, path, expected }) => {
      const result = transformData(error, navRules, data, question, path);
      expect(result).toStrictEqual(expected);
    },
  );
});
