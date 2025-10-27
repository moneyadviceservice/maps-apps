import { z } from 'zod';

import { Entry, EntryData } from '../lib/types';
import * as mockValidationSchemas from '../routes/routeSchemas';
import { validateFormSubmission } from './validateFormSubmission';

describe('validateFormSubmission (mocked schema)', () => {
  const steps = ['mockStep'];

  const mockSchema = z.object({
    'field-1': z.string().min(1, { error: 'Field 1 is required' }),
    'field-2': z.string().min(5, { error: 'Field 2 is required' }),
  });

  beforeEach(() => {
    // Mock the validationSchemas object directly
    (mockValidationSchemas as any).validationSchemas = {
      mockStep: mockSchema,
    };
  });

  const entry: Entry = {
    data: {} as EntryData,
    stepIndex: 0,
    errors: {},
  };

  let mockEntry: EntryData = {
    flow: 'test-route-flow',
    lang: 'en',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns no errors when validation passes', () => {
    mockEntry = {
      ...mockEntry,
      'field-1': 'hello',
      'field-2': 'world!',
      flow: 'test-route-flow',
    };

    const result = validateFormSubmission(entry, mockEntry, steps);
    expect(result).toEqual(undefined); // No errors
  });

  it('returns errors when validation fails', () => {
    mockEntry = {
      ...mockEntry,
      'field-1': '',
      'field-2': '123',
    };

    const result = validateFormSubmission(entry, mockEntry, steps);
    expect(result).toEqual({
      'field-1': ['Field 1 is required'],
      'field-2': ['Field 2 is required'],
    });
  });

  it('returns no errors and warns when schema is missing for step', () => {
    const consoleSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    (mockValidationSchemas as any).validationSchemas = {};

    const result = validateFormSubmission(entry, mockEntry, ['missingStep']);
    expect(result).toEqual(undefined); // No errors
    expect(consoleSpy).toHaveBeenCalledWith(
      'No validation schema found for step: missingStep. Skipping validation.',
    );

    consoleSpy.mockRestore();
  });
});
