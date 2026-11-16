/**
 * Self-serve firm details route flow:
 * customer contact → principle place of business → opening hours → confirm
 *
 * - Contact:   /account/firm-details/customer-contact-details/{firmId}
 * - PPB:       /account/firm-details/principle-place-of-business/{firmId}
 * - Hours:     /account/firm-details/opening-hours/{firmId}
 * - Confirm:   /account/firm-details/confirm-details/{firmId}
 */
export function customerContactDetailsPath(firmId: string): string {
  return `/account/firm-details/customer-contact-details/${firmId}`;
}

export function principlePlaceOfBusinessPath(firmId: string): string {
  return `/account/firm-details/principle-place-of-business/${firmId}`;
}

export function openingHoursPath(firmId: string): string {
  return `/account/firm-details/opening-hours/${firmId}`;
}

export function confirmDetailsPath(firmId: string): string {
  return `/account/firm-details/confirm-details/${firmId}`;
}

/** Change-answer steps return to confirm; otherwise use the linear previous step. */
export function firmDetailsBackLink(
  firmId: string,
  isChangeAnswer: string | null | undefined,
  linearBackLink: string,
): string {
  return isChangeAnswer === 'true'
    ? confirmDetailsPath(firmId)
    : linearBackLink;
}
