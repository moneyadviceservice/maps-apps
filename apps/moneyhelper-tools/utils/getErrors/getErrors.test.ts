import { DataPath } from 'types';

import { getErrors } from './getErrors';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

jest.mock('data/form-content/errors', () => ({
  midLifeMotErrorMessages: jest.fn(),
}));

import { midLifeMotErrorMessages } from 'data/form-content/errors';

describe('getErrors', () => {
  it('should return midLifeMotErrorMessages when path is DataPath.MidLifeMot', () => {
    const z = jest.fn();
    getErrors(z, DataPath.MidLifeMot);
    expect(midLifeMotErrorMessages).toHaveBeenCalledWith(z);
  });

  it('should return an empty array for unknown paths', () => {
    const z = jest.fn();
    const errors = getErrors(z, 'UnknownPath' as DataPath);
    expect(errors).toEqual([]);
  });
});
