import { TRAVEL_INSURANCE_DIRECTORY_ANALYTICS_PRODUCT_NAME } from 'lib/analytics/pageAnalytics';

import {
  LISTINGS_FIRMS_EXPORT_FILENAME,
  LISTINGS_FIRMS_EXPORT_FILE_TYPE,
  buildListingsFirmsExportFileDownloadEventInfo,
} from './trackListingsFirmsExportDownload';

describe('trackListingsFirmsExportDownload', () => {
  it('returns fileDownload eventInfo shape', () => {
    expect(buildListingsFirmsExportFileDownloadEventInfo()).toEqual({
      file: {
        name: LISTINGS_FIRMS_EXPORT_FILENAME,
        type: LISTINGS_FIRMS_EXPORT_FILE_TYPE,
      },
      product: TRAVEL_INSURANCE_DIRECTORY_ANALYTICS_PRODUCT_NAME,
    });
  });
});
