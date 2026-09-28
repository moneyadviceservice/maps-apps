import { BookingEntry } from '../types';
import { resolveNextEditStep } from './resolveNextEditStep';

const createEntry = (stepIndex = 0): BookingEntry =>
  ({
    steps: ['appointment-type', 'contact-details', 'confirm-details'],
    stepIndex,
  } as BookingEntry);

describe('resolveNextEditStep', () => {
  it('moves to an existing later step when step token is already in flow', () => {
    const entry = createEntry(0);

    resolveNextEditStep(entry, 'confirm-details');

    expect(entry.stepIndex).toBe(2);
    expect(entry.steps).toEqual([
      'appointment-type',
      'contact-details',
      'confirm-details',
    ]);
  });

  it('inserts a missing step token after current step and advances', () => {
    const entry = createEntry(0);

    resolveNextEditStep(entry, 'communication-preferences');

    expect(entry.stepIndex).toBe(1);
    expect(entry.steps).toEqual([
      'appointment-type',
      'communication-preferences',
      'contact-details',
      'confirm-details',
    ]);
  });

  it('advances by one when no step token is provided', () => {
    const entry = createEntry(0);

    resolveNextEditStep(entry, '');

    expect(entry.stepIndex).toBe(1);
    expect(entry.steps).toEqual([
      'appointment-type',
      'contact-details',
      'confirm-details',
    ]);
  });

  it('advances by one when step token is undefined', () => {
    const entry = createEntry(0);

    resolveNextEditStep(entry, undefined as unknown as string);

    expect(entry.stepIndex).toBe(1);
    expect(entry.steps).toEqual([
      'appointment-type',
      'contact-details',
      'confirm-details',
    ]);
  });
});
