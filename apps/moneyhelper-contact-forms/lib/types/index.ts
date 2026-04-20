import { Entry } from '@maps-react/mhf/types';

import { SubmissionState } from '../constants';

// Extended RouteFlowValue for contact forms with additional properties
export interface ContactFlowConfig {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
  autoAdvanceStep?: string;
}

export type ContactFlowConfigMap = Map<string, ContactFlowConfig>;

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
