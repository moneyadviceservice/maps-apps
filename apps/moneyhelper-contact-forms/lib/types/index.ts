import { RouteFlowValue } from '@maps-react/mhf/types';

import { StepName } from '../constants';

// Extended RouteFlowValue for contact forms with additional properties
export interface ContactRouteFlowValue extends RouteFlowValue {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
  autoAdvanceStep?: StepName;
}

export type ContactRouteFlow = Map<string, ContactRouteFlowValue>;
