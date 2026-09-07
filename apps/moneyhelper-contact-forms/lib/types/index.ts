import { Entry, FlowConfigValue } from '@maps-react/mhf/types';

import { SubmissionState } from '../constants';

// Extend FlowConfigValue with contact form specific properties
export interface ContactFlowConfig extends FlowConfigValue {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
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
