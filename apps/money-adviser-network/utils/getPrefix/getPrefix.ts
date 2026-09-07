import { FLOW } from '../getQuestions';

export const getPrefix = (currentFlow: FLOW) => {
  switch (currentFlow) {
    case FLOW.START:
      return 'q-';
    case FLOW.ONLINE:
      return 'o-';
    case FLOW.TELEPHONE:
      return 't-';
    default:
      return 'q-';
  }
};
