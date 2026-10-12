import { getNextStepPath } from './getNextStepPath';

describe('getNextStepPath', () => {
  const firstPath = '/register/firm';
  const scenarioPath = '/register/scenario';
  const unsuccessfulPath = '/register/unsuccessful';

  const testCases = [
    // Step 1: FOS/FSCS Coverage
    {
      current: firstPath,
      step: 'step1',
      val: 'true',
      expected: `${firstPath}/step2`,
      desc: 'Step 1: Yes -> Step 2',
    },
    {
      current: firstPath,
      step: 'step1',
      val: 'false',
      expected: unsuccessfulPath,
      desc: 'Step 1: No -> Unsuccessful',
    },

    // Step 2: Medical Risk Assessment
    {
      current: firstPath,
      step: 'step2',
      val: 'bespoke',
      expected: `${firstPath}/step3`,
      desc: 'Step 2: bespoke -> Step 3',
    },
    {
      current: firstPath,
      step: 'step2',
      val: 'questionaire',
      expected: `${firstPath}/step3`,
      desc: 'Step 2: questionnaire -> Step 3',
    },
    {
      current: firstPath,
      step: 'step2',
      val: 'non-proprietary',
      expected: `${firstPath}/step3`,
      desc: 'Step 2: non-proprietary -> Step 3',
    },
    {
      current: firstPath,
      step: 'step2',
      val: 'neither',
      expected: unsuccessfulPath,
      desc: 'Step 2: neither -> Unsuccessful',
    },

    // Step 3: Evidence of Capability
    {
      current: firstPath,
      step: 'step3',
      val: 'true',
      expected: `${scenarioPath}`,
      desc: 'Step 3: Yes -> Scenario landing page',
    },
    {
      current: firstPath,
      step: 'step3',
      val: 'true',
      expected: '/register/confirm-details',
      desc: 'Step 3: Yes (with change flag) -> confirm-details',
      fromConfirm: 'true',
    },
    {
      current: firstPath,
      step: 'step3',
      val: 'false',
      expected: unsuccessfulPath,
      desc: 'Step 3: No -> Unsuccessful',
    },

    // Flow 2: Scenario questionnaire
    {
      current: scenarioPath,
      step: 'step1',
      val: 'true',
      expected: `${scenarioPath}/step2`,
      desc: 'Scenario: Default next path',
    },
    {
      current: scenarioPath,
      step: 'step19',
      val: 'true',
      expected: '/register/confirm-details',
      desc: 'Scenario: End of flow',
    },
    {
      current: scenarioPath,
      step: 'step3',
      val: 'true',
      expected: '/register/confirm-details',
      desc: 'Scenario: Changing an answer after completing all questions',
      fromConfirm: 'true',
    },

    // Edge Cases
    {
      current: firstPath,
      step: 'invalid-step',
      val: 'true',
      expected: `/register/step1`,
      desc: 'Edge Case: Invalid step',
    },
  ];

  test.each(testCases)(
    '$desc',
    ({ current, step, val, expected, fromConfirm }) => {
      const change = !!fromConfirm;
      expect(getNextStepPath(current, step, val, change)).toBe(expected);
    },
  );
});
