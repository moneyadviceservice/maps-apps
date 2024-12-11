import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  onlineQuestions,
  startQuestions,
  telephoneQuestions,
} from '../../data/questions';

export enum FLOW {
  START = 'start',
  ONLINE = 'online',
  TELEPHONE = 'telephone',
}

export const getQuestions = (
  flow: FLOW,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  switch (flow) {
    case FLOW.START: {
      return startQuestions(z);
    }
    case FLOW.ONLINE: {
      return onlineQuestions(z);
    }
    case FLOW.TELEPHONE: {
      return telephoneQuestions(z);
    }
  }
};
