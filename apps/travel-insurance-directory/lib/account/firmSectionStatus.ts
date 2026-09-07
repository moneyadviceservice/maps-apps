/**
 * Account section completion for trip cover and service details.
 * Trip cover "complete" means every age-limit field is saved (including not offered).
 * Public listing eligibility uses hasPositiveAgeLimit in lib/firms/firmDocument.ts.
 */
import type { AccountSectionStatus } from 'components/Account/AccountSectionStatusBadge';
import {
  confirmDetailsPath,
  customerContactDetailsPath,
} from 'lib/account/firmDetails/firmDetailsRoutes';
import { isTripCoverAgeStepComplete } from 'lib/account/tripCover/TripCoverAgeLimits';
import {
  confirmPath,
  regionsPath,
} from 'lib/account/tripCover/steps/tripCoverRoutes';
import { emptyServiceDetails } from 'lib/firms/firmDefaults';
import type {
  ServiceDetails,
  TravelInsuranceFirmDocument,
  TripCover,
} from 'types/travel-insurance-firm';

const SERVICE_DETAIL_KEYS = Object.keys(
  emptyServiceDetails(),
) as (keyof ServiceDetails)[];

function hasNonEmptyString(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

export function isServiceDetailsComplete(
  service_details: ServiceDetails,
): boolean {
  if (!service_details) {
    return false;
  }

  return (
    service_details.offers_telephone_quote !== null &&
    service_details.will_cover_specialist_equipment !== null &&
    service_details.how_far_in_advance_trip_cover !== null &&
    hasNonEmptyString(service_details.medical_screening_company)
  );
}

export function isServiceDetailsStarted(
  service_details: ServiceDetails,
): boolean {
  return SERVICE_DETAIL_KEYS.some((key) => service_details[key] !== null);
}

export function areTripCoversComplete(trip_covers: TripCover[]): boolean {
  if (trip_covers.length === 0) {
    return false;
  }

  return trip_covers.every(isTripCoverAgeStepComplete);
}

export function areTripCoversStarted(trip_covers: TripCover[]): boolean {
  return trip_covers.length > 0;
}

export function isCoverAndServiceDataComplete(
  firm: TravelInsuranceFirmDocument,
): boolean {
  return (
    isServiceDetailsComplete(firm.service_details) &&
    areTripCoversComplete(firm.trip_covers)
  );
}

/** True after first Cover & Service confirm; also gates staging later edits to draft. */
export function isCoverAndServiceConfirmed(
  firm: TravelInsuranceFirmDocument,
): boolean {
  return Boolean(firm.cover_service_confirmed_at?.trim());
}

export function getCoverAndServiceSectionStatus(
  firm: TravelInsuranceFirmDocument,
): AccountSectionStatus {
  if (!areTripCoversStarted(firm.trip_covers)) {
    return 'not_started';
  }

  if (isCoverAndServiceDataComplete(firm) && isCoverAndServiceConfirmed(firm)) {
    return 'completed';
  }

  return 'in_progress';
}

export function isCustomerContactComplete(
  firm: TravelInsuranceFirmDocument,
): boolean {
  const office = firm.office;
  if (!office) {
    return false;
  }

  // 1. Address Validation: line_one, town, county (or country), and postcode are required
  const address = office.address;
  const isAddressComplete =
    hasNonEmptyString(address?.line_one) &&
    hasNonEmptyString(address?.town) &&
    (hasNonEmptyString(address?.county) ||
      hasNonEmptyString(address?.country)) &&
    hasNonEmptyString(address?.postcode);

  // 2. Contact Validation: Either telephone_number OR email_address is required
  const telephoneValue = office.contact?.telephone_number;
  const hasTelephone =
    telephoneValue !== null &&
    telephoneValue !== undefined &&
    String(telephoneValue).trim() !== '';
  const hasEmail = hasNonEmptyString(office.contact?.email_address);

  const isContactComplete = hasTelephone || hasEmail;

  // 3. Opening Times Validation: weekday must have opening_time and closing_time strings
  const isOpeningTimesComplete =
    hasNonEmptyString(office.opening_times?.weekday?.opening_time) &&
    hasNonEmptyString(office.opening_times?.weekday?.closing_time);

  return isAddressComplete && isContactComplete && isOpeningTimesComplete;
}

function isCustomerContactStarted(firm: TravelInsuranceFirmDocument): boolean {
  if (firm.office !== null && firm.office !== undefined) {
    // Create a recursive helper function
    const hasActualValue = (val: unknown): boolean => {
      if (val === null || val === undefined || val === '') {
        return false;
      }

      if (typeof val === 'object') {
        return Object.values(val).some(hasActualValue);
      }

      return true;
    };

    return Object.values(firm.office).some(hasActualValue);
  }

  return false;
}

/** True after first Customer Contact confirm; also gates staging later edits to draft. */
export function isCustomerContactConfirmed(
  firm: TravelInsuranceFirmDocument,
): boolean {
  return Boolean(firm.customer_contact_confirmed_at?.trim());
}

export function getCustomerContactSectionStatus(
  firm: TravelInsuranceFirmDocument,
): AccountSectionStatus {
  if (isCustomerContactComplete(firm) && isCustomerContactConfirmed(firm)) {
    return 'completed';
  }

  if (isCustomerContactStarted(firm) || isCustomerContactComplete(firm)) {
    return 'in_progress';
  }

  return 'not_started';
}

export function getFirmSectionStatuses(firm: TravelInsuranceFirmDocument): {
  coverAndService: AccountSectionStatus;
  customerContactDetails: AccountSectionStatus;
} {
  return {
    coverAndService: getCoverAndServiceSectionStatus(firm),
    customerContactDetails: getCustomerContactSectionStatus(firm),
  };
}

export function areFirmSectionsComplete(
  firm: TravelInsuranceFirmDocument,
): boolean {
  const statuses = getFirmSectionStatuses(firm);
  return (
    statuses.coverAndService === 'completed' &&
    statuses.customerContactDetails === 'completed'
  );
}

export function resolveDirectoryStatusForFirm(
  firm: TravelInsuranceFirmDocument,
): 'hidden' | 'pending_approval' {
  return areFirmSectionsComplete(firm) ? 'pending_approval' : 'hidden';
}

export function resolveDirectoryStatusAfterRegistration(
  mainFirm: TravelInsuranceFirmDocument,
  tradingFirms: TravelInsuranceFirmDocument[],
): 'hidden' | 'pending_approval' {
  if (areFirmSectionsComplete(mainFirm)) {
    return 'pending_approval';
  }
  if (tradingFirms.some(areFirmSectionsComplete)) {
    return 'pending_approval';
  }
  return 'hidden';
}

export function buildDirectoryStatusPatch(
  status: 'hidden' | 'pending_approval',
): Record<string, string | null> {
  if (status === 'pending_approval') {
    return { status, hidden_at: null };
  }
  return { status };
}

function withResetDraft(path: string): string {
  return `${path}?resetDraft=true`;
}

/**
 * Account home link for Cover & Service.
 * Confirmed → confirm summary with resetDraft. Otherwise restart at regions (no reset).
 */
export function coverAndServiceAccountHref(
  firmId: string,
  firm: TravelInsuranceFirmDocument,
): string {
  if (isCoverAndServiceConfirmed(firm)) {
    return withResetDraft(confirmPath(firmId));
  }

  return regionsPath(firmId);
}

/**
 * Account home link for Customer Contact.
 * Confirmed → confirm summary with resetDraft. Otherwise restart at contact (no reset).
 */
export function customerContactAccountHref(
  firmId: string,
  firm: TravelInsuranceFirmDocument,
): string {
  if (isCustomerContactConfirmed(firm)) {
    return withResetDraft(confirmDetailsPath(firmId));
  }

  return customerContactDetailsPath(firmId);
}
