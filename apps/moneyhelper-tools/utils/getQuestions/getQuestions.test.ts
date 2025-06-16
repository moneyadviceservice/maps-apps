import { DataPath } from 'types';

import { getQuestions } from './getQuestions';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

jest.mock('data/form-content/questions', () => ({
  midLifeMotQuestions: jest.fn(),
}));

import { midLifeMotQuestions } from 'data/form-content/questions';

describe('getQuestions', () => {
  it('should return midLifeMotQuestions when path is DataPath.MidLifeMot', () => {
    const z = jest.fn();
    getQuestions(z, DataPath.MidLifeMot);
    expect(midLifeMotQuestions).toHaveBeenCalledWith(z);
  });

  it('should return an empty array for unknown paths', () => {
    const z = jest.fn();
    const questions = getQuestions(z, 'UnknownPath' as DataPath);
    expect(questions).toEqual([]);
  });
});
