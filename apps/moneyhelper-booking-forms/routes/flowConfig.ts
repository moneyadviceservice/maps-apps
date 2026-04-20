import { FlowConfig } from '@maps-react/mhf/types';

import { FlowName } from '../lib/constants';

/**
 * Central configuration for flows in the app. Each flow can have custom properties that influence app behavior.
 * EG:
 *  - hideSideBar to drive UI differences in the sidebar navigation component
 *
 * @see flowConfig
 */
export const flowConfig: FlowConfig = new Map([
  [FlowName.PENSION_WISE, {}],
  [FlowName.SELF_EMPLOYED, {}],
  [FlowName.DIVORCE_SEPARATION, {}],
  [FlowName.PENSION_LOSS, {}],
]);
