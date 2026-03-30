import { useEffect } from 'react';

import { convertCSPReportToString } from '../utils/convertCSPReportToString/convertCSPReportToString';
import { saveDataToBlob } from '../utils/netlify/handleCSPViolationBlob';

/**
 * The useReportingObserver hook is observing for any csp violations and
 * if find any will save them to a netlify blob
 * This hook works only in Chrome, Edge and Safari
 */
export const useReportingObserver = () => {
  const observeViolations = async () => {
    let violations = '';

    if (
      typeof window !== 'undefined' &&
      typeof ReportingObserver !== 'undefined'
    ) {
      const observer = new ReportingObserver(
        async (reports, observer) => {
          reports.forEach((violation) => {
            if (violation.body)
              violations += convertCSPReportToString(violation?.body?.toJSON());
          });
          try {
            if (violations.length > 0) await saveDataToBlob(violations);
          } catch (e) {
            console.warn('Failed to save csp violations to Netlify blobs');
          }
        },
        {
          types: ['csp-violation'],
          buffered: true,
        },
      );

      observer.observe();
    }
  };
  useEffect(() => {
    observeViolations();
  });
};
