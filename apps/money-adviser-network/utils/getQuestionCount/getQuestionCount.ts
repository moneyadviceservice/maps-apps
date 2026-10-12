import { FLOW, getQuestions } from 'utils/getQuestions';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export const getQuestionCount = (
  flow: FLOW,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const questions = getQuestions(flow, z);

  return questions.length;
};
