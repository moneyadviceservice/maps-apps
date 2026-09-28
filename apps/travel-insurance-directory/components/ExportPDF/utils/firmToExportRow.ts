import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export interface FirmExportRow {
  readonly name: string;
  readonly website: string;
  readonly phone: string;
  readonly email: string;
}

/**
 * Maps a firm document to a row shape used by ExportPDF (name, website, phone, email).
 * Uses office contact for phone/email when present.
 */
export function firmToExportRow(
  firm: TravelInsuranceFirmDocument,
): FirmExportRow {
  const office = firm.office;
  return {
    name: firm.registered_name ?? '',
    website: firm.website_address ?? office?.contact?.website ?? '',
    phone: office?.contact?.telephone_number ?? '',
    email: office?.contact?.email_address ?? '',
  };
}
