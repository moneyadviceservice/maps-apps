import { Entry } from '../types';
import { getFlowSteps } from './getFlowSteps';

jest.mock('../../routes/routeFlow', () => ({
  routeFlow: new Map<string, string[]>([
    ['test-flow', ['step-1', 'step-2', 'step-3']],
    ['empty-flow', []],
  ]),
}));

describe('getFlowSteps', () => {
  let mockEntry: Entry;

  beforeEach(() => {
    mockEntry = {
      data: {
        flow: 'test-flow',
        lang: 'en',
      },
      stepIndex: 0,
      errors: {},
    };
  });

  it('should return the steps for a valid flow', () => {
    const steps = getFlowSteps(mockEntry);
    expect(steps).toEqual(['step-1', 'step-2', 'step-3']);
  });

  it('should return an empty array if the entry is invalid', () => {
    const invalidEntry = { data: null };
    const steps = getFlowSteps(invalidEntry as unknown as Entry);
    expect(steps).toEqual([]);
  });

  it('should throw an error if the flow has no steps', () => {
    const emptyFlowEntry = { data: { flow: 'empty-flow' } } as Entry;
    expect(() => getFlowSteps(emptyFlowEntry)).toThrow(
      'No steps found for flow: ',
    );
  });
});
