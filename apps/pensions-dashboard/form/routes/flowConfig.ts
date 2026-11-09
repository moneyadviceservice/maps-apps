import { FlowConfig } from '@maps-react/mhf/types';

import { FlowName } from '../constants';

/**
 * Central configuration for flows in the app. Each flow can have custom properties that influence app behavior.
 *
 * @see flowConfig
 */
export const flowConfig: FlowConfig = new Map([[FlowName.BASE, {}]]);
