import {
  Entry,
  FlowConfigValue,
  RouteConfig,
  StepComponent,
} from '@maps-react/mhf/types';

import { SidebarType, SubmissionState } from '../constants';

export interface BookingEntry extends Entry {
  editMode?: boolean;
  referral?: Referral;
}

export type BookingStepProps = Omit<Parameters<StepComponent>[0], 'entry'> & {
  entry?: BookingEntry;
};

export type BookingStepComponent = (
  props: BookingStepProps,
) => ReturnType<StepComponent>;

// Extended RouteFlowValue for contact forms with additional properties
export interface BookingFlowConfig extends FlowConfigValue {
  autoAdvanceStep?: string;
}

export type BookingFlowConfigMap = Map<string, BookingFlowConfig>;

// Referral information captured during the booking process (TBC - See: https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1214/LLD-Booking-Form?anchor=data-shape)
type Referral = {
  source: 'stronger-nudge' | 'direct';
  organisation?: string; // resolved from registry or captured from user
  code?: string; // raw query param, e.g. "pensionServiceA"
  resolved: boolean; // true if matched in registry
};

export interface BookingRouteConfig extends RouteConfig {
  [key: string]: RouteConfig[string] & {
    sidebarType?: SidebarType.HELP | SidebarType.INFORMATION;
    hideBackStep?: boolean;
    hideBackStepInEditMode?: boolean;
    hideTitle?: boolean;
  };
}

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
