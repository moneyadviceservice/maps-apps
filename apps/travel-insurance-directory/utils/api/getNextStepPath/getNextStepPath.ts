import { page } from 'data/pages/register/firmQuestions';

/**
 * Handles the branching logic for the registration flow.
 * Returns the path the user should be directed to.
 */
export const getNextStepPath = (
  step: keyof typeof page,
  answer: string,
): string => {
  switch (step) {
    case 'step1': // covered_by_ombudsman_question
      return answer === 'true'
        ? '/register/firm/step2'
        : '/register/unsuccessful';

    case 'step2': // risk_profile_approach_question
      return answer === 'neither'
        ? '/register/unsuccessful'
        : '/register/firm/step3';

    case 'step3': // supplies_document_when_needed_question
      return answer === 'true'
        ? '/register/firm/step4'
        : '/register/unsuccessful';

    case 'step4': // covers_medical_condition_question
      return answer === 'one_specific'
        ? '/register/success'
        : '/register/scenario/step1';

    default:
      return '/register/step1';
  }
};
