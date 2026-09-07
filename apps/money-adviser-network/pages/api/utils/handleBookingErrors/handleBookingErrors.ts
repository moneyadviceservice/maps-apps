import { NextApiResponse } from 'next';

import { PAGES } from '../../../../CONSTANTS';
import { allSubmitErrors } from '../../../../data/errors';
import { DataFromQuery } from '../../../../utils/pageFilter';

export const handleBookingErrors = (
  error: string,
  res: NextApiResponse,
  path: string,
  parsedUrlData: DataFromQuery,
) => {
  const queryString = Object.keys(parsedUrlData as Record<string, string>)
    .map((key) => {
      return `${key}=${encodeURIComponent(
        parsedUrlData && key ? parsedUrlData[key] : '',
      )}`;
    })
    .join('&');

  switch (error) {
    case allSubmitErrors.NoSlotForDate:
    case allSubmitErrors.invalidSlotFormat:
    case allSubmitErrors.capacityFull:
    case allSubmitErrors.noSlotsAvailable:
      return res.redirect(302, `/${path}/t-8?${queryString}`);
    case allSubmitErrors.outOfOfficeHours:
      return res.redirect(302, `/${path}/t-9?${queryString}`);
    case allSubmitErrors.contactRecordsIssue:
    default: {
      const parsedDataWithError: DataFromQuery = {
        ...parsedUrlData,
        ...{ error: error },
      };

      const queryStringWithError = Object.keys(
        parsedDataWithError as Record<string, string>,
      )
        .map((key) => {
          return `${key}=${encodeURIComponent(
            parsedDataWithError && key ? parsedDataWithError[key] : '',
          )}`;
        })
        .join('&');

      res.redirect(
        302,
        `/${path}/${PAGES.CONFIRM_ANSWERS}?${queryStringWithError}`,
      );
    }
  }
};
