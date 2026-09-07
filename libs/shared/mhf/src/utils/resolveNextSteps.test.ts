import { Entry } from '../types';
import { resolveNextSteps } from './resolveNextSteps';

describe('resolveNextSteps', () => {
  it('rebases future steps when next step is provided', () => {
    const entry: Entry = {
      stepIndex: 1,
      steps: ['step1', 'step2', 'step3', 'step4'],
      data: {},
      errors: {},
    };

    resolveNextSteps(entry, 'newStep');

    expect(entry.steps).toEqual(['step1', 'step2', 'newStep']);
  });

  it('does not modify steps when no next step is provided', () => {
    const entry: Entry = {
      stepIndex: 1,
      steps: ['step1', 'step2', 'step3', 'step4'],
      data: {},
      errors: {},
    };

    resolveNextSteps(entry);

    expect(entry.steps).toEqual(['step1', 'step2', 'step3', 'step4']);
  });
});
