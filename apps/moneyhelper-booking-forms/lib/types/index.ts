import { Entry, RouteConfig } from '@maps-react/mhf/types';

import { SidebarType } from '../constants';

export interface BookingEntry extends Entry {
  referral?: Referral;
}

// Referral information captured during the booking process (TBC - See: https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1214/LLD-Booking-Form?anchor=data-shape)
type Referral = {
  source: 'stronger-nudge' | 'direct';
  organisation?: string; // resolved from registry or captured from user
  code?: string; // raw query param, e.g. "pensionServiceA"
  resolved: boolean; // true if matched in registry
};
/**
 * BookingRouteConfig extends the base RouteConfig to include optional sidebar configuration for each route.
 */
export interface BookingRouteConfig extends RouteConfig {
  [key: string]: RouteConfig[string] & {
    sidebar?: SidebarType.HELP | SidebarType.INFORMATION;
  };
}
