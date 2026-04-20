import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export interface FirmExportRow {
  readonly name: string;
  readonly website: string;
  readonly phone: string;
  readonly email: string;
}

/**
 * Maps a firm document to a row shape used by ExportPDF (name, website, phone, email).
 * Uses first office contact for phone/email when present.
 */
export function firmToExportRow(
  firm: TravelInsuranceFirmDocument,
): FirmExportRow {
  const firstOffice = firm.offices?.[0];
  return {
    name: firm.registered_name ?? '',
    website: firm.website_address ?? firstOffice?.contact?.website ?? '',
    phone: firstOffice?.contact?.telephone_number ?? '',
    email: firstOffice?.contact?.email_address ?? '',
  };
}
