import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  defaultPageTitles,
  onlinePageTitles,
  startPageTitles,
  telephonePageTitles,
} from '../../data/pageTitles';

export enum FLOW {
  START = 'start',
  ONLINE = 'online',
  TELEPHONE = 'telephone',
}

export const getPageTitle = (
  step: string | number,
  z: ReturnType<typeof useTranslation>['z'],
  flow?: FLOW,
) => {
  switch (flow) {
    case FLOW.START: {
      return startPageTitles(z)[step];
    }
    case FLOW.ONLINE: {
      return onlinePageTitles(z)[step];
    }
    case FLOW.TELEPHONE: {
      return telephonePageTitles(z)[step];
    }
    default: {
      return defaultPageTitles(z)[step];
    }
  }
};
