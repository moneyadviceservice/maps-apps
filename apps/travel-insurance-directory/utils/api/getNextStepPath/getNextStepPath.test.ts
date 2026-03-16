import { getNextStepPath } from './getNextStepPath';

describe('getNextStepPath', () => {
  describe('Step 1: FOS/FSCS Coverage', () => {
    it('should route to step 2 when answer is "yes" (AC1)', () => {
      expect(getNextStepPath('step1', 'true')).toBe('/register/firm/step2');
    });

    it('should route to unsuccessful when answer is "no" (AC2)', () => {
      expect(getNextStepPath('step1', 'false')).toBe('/register/unsuccessful');
    });
  });

  describe('Step 2: Medical Risk Assessment', () => {
    const successValues = ['bespoke', 'questionaire', 'non-proprietary'];

    it.each(successValues)(
      'should route to step 3 when answer is "%s"',
      (value) => {
        expect(getNextStepPath('step2', value)).toBe('/register/firm/step3');
      },
    );

    it('should route to unsuccessful when answer is "noneOfTheAbove" (AC6)', () => {
      expect(getNextStepPath('step2', 'neither')).toBe(
        '/register/unsuccessful',
      );
    });
  });

  describe('Step 3: Evidence of Capability', () => {
    it('should route to step 4 when answer is "yes" (AC7)', () => {
      expect(getNextStepPath('step3', 'true')).toBe('/register/firm/step4');
    });

    it('should route to unsuccessful when answer is "no" (AC8)', () => {
      expect(getNextStepPath('step3', 'false')).toBe('/register/unsuccessful');
    });
  });

  describe('Step 4: Specialism Selection', () => {
    it('should route to success when answer is "specificSeriousMedicalCondition" (AC9)', () => {
      expect(getNextStepPath('step4', 'one_specific')).toBe(
        '/register/success',
      );
    });

    it('should route to scenario step 1 when answer is "anyMostSeriousMedicalConditions" (AC10)', () => {
      expect(getNextStepPath('step4', 'all')).toBe('/register/scenario/step1');
    });
  });

  describe('Edge Cases', () => {
    it('should return default start path if an invalid step is provided', () => {
      // @ts-expect-error - testing runtime fallback for invalid step input
      expect(getNextStepPath('invalid-step', 'yes')).toBe('/register/step1');
    });
  });
});
