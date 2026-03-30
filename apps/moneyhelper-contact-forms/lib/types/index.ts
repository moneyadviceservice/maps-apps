import { Entry, RouteFlowValue } from '@maps-react/mhf/types';

import { StepName, SubmissionState } from '../constants';

// Extended RouteFlowValue for contact forms with additional properties
export interface ContactRouteFlowValue extends RouteFlowValue {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
  autoAdvanceStep?: StepName;
}

export type ContactRouteFlow = Map<string, ContactRouteFlowValue>;

export type ResponseData = {
  status: string;
  message: string | number;
};

export type SubmissionMeta = {
  submissionState: SubmissionState;
  responseData?: ResponseData;
  submissionStartedAt?: string;
};

export type SubmissionEntry = Entry & {
  meta?: SubmissionMeta;
};
