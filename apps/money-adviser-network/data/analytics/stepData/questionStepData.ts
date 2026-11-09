import { getPageTitle } from 'utils/getPageTitle';
import { getPrefix } from 'utils/getPrefix';
import { FLOW } from 'utils/getQuestions';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export const questionStepData = (
  z: ReturnType<typeof useTranslation>['z'],
  en: ReturnType<typeof useTranslation>['z'],
  currentStep: number,
  currentFlow: FLOW,
) => ({
  pageName: `${getPrefix(currentFlow)}${currentStep}`,
  pageTitle: getPageTitle(currentStep, z, currentFlow),
  stepName: getPageTitle(currentStep, en, currentFlow),
});
