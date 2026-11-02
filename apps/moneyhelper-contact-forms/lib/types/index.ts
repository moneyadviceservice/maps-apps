import { FlowConfigValue, ResponseData } from '@maps-react/mhf/types';

// Extend FlowConfigValue with contact form specific properties
export interface ContactFlowConfig extends FlowConfigValue {
  showBookingReferenceField?: boolean;
  phoneNumberRequired?: boolean;
}

export type ContactFlowConfigMap = Map<string, ContactFlowConfig>;

export type ContactResponseData = ResponseData & {
  status: boolean;
  message: string | number;
};
