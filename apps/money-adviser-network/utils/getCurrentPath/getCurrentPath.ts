import { PATHS, TOOL_BASE_PATH } from '../../CONSTANTS';
import { FLOW } from '../getQuestions';

export const getCurrentPath = (flow?: FLOW) => {
  switch (flow) {
    case FLOW.START: {
      return PATHS.START;
    }
    case FLOW.ONLINE: {
      return PATHS.ONLINE;
    }
    case FLOW.TELEPHONE: {
      return PATHS.TELEPHONE;
    }
    default: {
      return TOOL_BASE_PATH;
    }
  }
};
