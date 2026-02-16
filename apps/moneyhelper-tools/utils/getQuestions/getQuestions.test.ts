import { DataPath } from 'types';

import { getQuestions } from './getQuestions';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));
describe('getQuestions', () => {
  it('should return an empty array for unknown paths', () => {
    const z = jest.fn();
    const questions = getQuestions(z, 'UnknownPath' as DataPath);
    expect(questions).toEqual([]);
  });
});
