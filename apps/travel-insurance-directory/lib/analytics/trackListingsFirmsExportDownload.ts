import { TRAVEL_INSURANCE_DIRECTORY_ANALYTICS_PRODUCT_NAME } from 'lib/analytics/pageAnalytics';

export const LISTINGS_FIRMS_EXPORT_FILENAME = 'travel-insurance-firms.pdf';

export const LISTINGS_FIRMS_EXPORT_FILE_TYPE = 'pdf';

/**
 * Adobe `eventInfo` for the firm listings PDF export link (`fileDownload`).
 */
export function buildListingsFirmsExportFileDownloadEventInfo(): {
  file: { name: string; type: string };
  product: string;
} {
  return {
    file: {
      name: LISTINGS_FIRMS_EXPORT_FILENAME,
      type: LISTINGS_FIRMS_EXPORT_FILE_TYPE,
    },
    product: TRAVEL_INSURANCE_DIRECTORY_ANALYTICS_PRODUCT_NAME,
  };
}
