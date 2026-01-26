import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { FLOW } from '../../utils/getQuestions';
import { validateOnlineQuestions } from './validateOnlineQuestions';
import { validateTelephoneQuestions } from './validateTelephoneQuestions';

export const validation = (
  flow: FLOW,
  question: number,
  data: DataFromQuery,
) => {
  switch (flow) {
    case FLOW.ONLINE:
      return validateOnlineQuestions(question, data);
    case FLOW.TELEPHONE:
      return validateTelephoneQuestions(question, data);
    default:
      return {};
  }
};
