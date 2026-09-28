import { NextApiRequest, NextApiResponse } from 'next';

import { getAllFirmsFromCosmos } from 'lib/firms/getAllFirmsFromCosmos';
import { tidFcaValidationReport } from 'lib/notify/tid-fca-validation-report';
import {
  buildResultArrays,
  ValidationResultArrays,
} from 'lib/scheduledJobs/services/buildResultArrays';
import {
  evaluateFirmState,
  indexTradingFirmsByMainFirmId,
} from 'lib/scheduledJobs/services/evaluateFirmState';
import { verifyScheduledJobSecret } from 'lib/scheduledJobs/verifyScheduledJobSecret';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyScheduledJobSecret(req.headers['x-scheduled-job-secret'])) {
    console.error('Unauthorized attempt to trigger scheduled job');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results: ValidationResultArrays = {
    failuresSummary: [],
    invalidFcaNumbers: [],
    reactivatedFirms: [],
    newFailures: [],
    asyncActions: [],
  };

  try {
    const fetchedFirms = await getAllFirmsFromCosmos({}, 1, 100);
    const tradingFirmsByMainFirmId = indexTradingFirmsByMainFirmId(
      fetchedFirms.firms,
    );

    const evaluations = await Promise.all(
      fetchedFirms.firms.map(async (firm) => {
        const stateResult = await evaluateFirmState(firm, {
          tradingFirmsByMainFirmId,
        });
        return { firm, stateResult };
      }),
    );

    // Build side-effects and reporting arrays
    for (const { firm, stateResult } of evaluations) {
      buildResultArrays(firm, stateResult, results);
    }

    // Execute bulk actions
    if (results.failuresSummary.length > 0) {
      results.asyncActions.push(
        tidFcaValidationReport(results.failuresSummary),
      );
    }

    await Promise.all(results.asyncActions);

    return res.status(200).json({
      success: true,
      totalProcessed: evaluations.length,
      invalidFcaNumbers: results.invalidFcaNumbers,
      totalFailureCount: results.invalidFcaNumbers.length,
      newFailures: results.newFailures,
      newFailuresSinceLastRun: results.newFailures.length,
      reactivatedFirms: results.reactivatedFirms,
      totalReactivatedFirms: results.reactivatedFirms.length,
    });
  } catch (err) {
    console.error('Error validating firms:', err);
    return res
      .status(500)
      .json({ error: 'An error occurred while validating firms' });
  }
}
