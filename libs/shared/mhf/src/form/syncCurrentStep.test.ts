import { mockEntry, mockSteps } from '../mocks';
import { Entry } from '../types';
import { syncCurrentStep } from './syncCurrentStep';

describe('syncCurrentStep', () => {
  it('updates stepIndex and clears errors when currentStep differs', () => {
    const entry: Entry = { ...mockEntry };

    syncCurrentStep(entry, mockSteps[1]);

    expect(entry.stepIndex).toBe(1);
    expect(entry.errors).toEqual({});
  });

  it('leaves errors unchanged when currentStep correctly matches currentStep', () => {
    const errors = { firstName: ['Enter your first name'] };
    const entry: Entry = { ...mockEntry, stepIndex: 1, errors };

    syncCurrentStep(entry, 'step-1');

    expect(entry.stepIndex).toBe(1);
    expect(entry.errors).toBe(errors);
  });

  it('throws when currentStep is not in the entry steps', () => {
    const entry: Entry = { ...mockEntry };

    expect(() => syncCurrentStep(entry, 'unknown')).toThrow(
      '[form-handler] Invalid currentStep: unknown - check that the step prop is passed in the FormWrapper and that the first step journey matches the initial step of the form',
    );
  });
});
