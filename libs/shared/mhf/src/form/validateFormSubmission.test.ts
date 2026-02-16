import { z } from 'zod';

import { mockEntry } from '../mocks';
import { validateFormSubmission } from './validateFormSubmission';

describe('validateFormSubmission', () => {
  const mockSchema = z.object({
    'field-1': z.string().min(1, { error: 'Field 1 is required' }),
    'field-2': z.string().min(5, { error: 'Field 2 is required' }),
  });

  const validationSchemas = {
    'step-0': mockSchema,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns no errors when validation passes', () => {
    const result = validateFormSubmission(
      mockEntry,
      {
        ...mockEntry.data,
        'field-1': 'hello',
        'field-2': 'world!',
      },
      validationSchemas,
    );
    expect(result).toEqual(undefined); // No errors
  });

  it('returns errors when validation fails', () => {
    mockEntry.data = {
      ...mockEntry.data,
      'field-1': '',
      'field-2': '123',
    };

    const result = validateFormSubmission(
      mockEntry,
      mockEntry.data,
      validationSchemas,
    );
    expect(result).toEqual({
      'field-1': ['Field 1 is required'],
      'field-2': ['Field 2 is required'],
    });
  });

  it('returns no errors and warns when schema is missing for step', () => {
    const consoleSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    const emptySchemas = {};

    const result = validateFormSubmission(
      mockEntry,
      mockEntry.data,
      emptySchemas,
    );
    expect(result).toEqual(undefined); // No errors
    expect(consoleSpy).toHaveBeenCalledWith(
      'No validation schema found for step: step-0. Skipping validation.',
    );

    consoleSpy.mockRestore();
  });
});
