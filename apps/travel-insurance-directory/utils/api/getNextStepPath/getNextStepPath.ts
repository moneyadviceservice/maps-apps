export const unsuccessfulPath = '/register/unsuccessful';
const scenarioQuestionsStartPath = '/register/scenario';
const startPath = '/register/step1';
const confirmDetailsPath = '/register/confirm-details';

const defaultNextStep = (
  step: string,
  currentPath: string,
  change?: boolean,
) => {
  const currentStepNumber = Number.parseInt(step?.replace('step', ''), 10);

  const stepPath = `step${currentStepNumber + 1}`;

  return change ? confirmDetailsPath : `${currentPath}/${stepPath}`;
};

const getNextFirmPagePath = (
  step: string,
  answer: string,
  defaultNextPath: string,
  change?: boolean,
) => {
  switch (step) {
    case 'step1': // covered_by_ombudsman_question
      return answer === 'true' ? defaultNextPath : unsuccessfulPath;

    case 'step2': // risk_profile_approach_question
      return answer === 'neither' ? unsuccessfulPath : defaultNextPath;

    case 'step3': // supplies_document_when_needed_question
      if (change && answer === 'true') {
        return defaultNextPath;
      }
      return answer === 'true' ? scenarioQuestionsStartPath : unsuccessfulPath;

    default:
      return startPath;
  }
};

/**
 * Handles the branching logic for the registration flow.
 * Returns the path the user should be directed to.
 */
export const getNextStepPath = (
  currentPath: string,
  step: string,
  answer: string,
  change?: boolean,
): string => {
  const defaultNextPath = defaultNextStep(step, currentPath, change);

  if (currentPath === '/register/firm') {
    return getNextFirmPagePath(step, answer, defaultNextPath, change);
  }

  if (step === 'step19') {
    return confirmDetailsPath;
  }

  return defaultNextPath;
};
