import { mockEntry, mockRouteFlow, mockSteps } from '../mocks';
import { Entry } from '../types';
import { getFlowSteps } from './getFlowSteps';

describe('getFlowSteps', () => {
  it('returns entry.steps if it exists and is non-empty', () => {
    const entry = {
      ...mockEntry,
      steps: ['step-1', 'step-2', 'step-3'],
    } as Entry;
    const steps = getFlowSteps(entry.data.flow, mockRouteFlow);
    expect(steps).toEqual(mockSteps);
  });

  it('throws if no steps found for flow', () => {
    const entry = {
      data: { flow: 'missing-flow', lang: 'en' },
    } as Entry;
    expect(() => getFlowSteps(entry.data.flow, mockRouteFlow)).toThrow(
      '[getSteps] No steps found for flow: missing-flow',
    );
  });
});
