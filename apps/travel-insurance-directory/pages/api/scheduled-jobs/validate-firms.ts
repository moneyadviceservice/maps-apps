import { NextApiRequest, NextApiResponse } from 'next';

import { getAllFirmsFromCosmos } from 'lib/firms/getAllFirmsFromCosmos';
import { tidFcaValidationReport } from 'lib/notify/tid-fca-validation-report';
import { validateFcaNumber } from 'lib/validate-firms/validate-fca';
import { validateFirmPrincipals } from 'lib/validate-firms/validate-principles';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const fetchedFirms = await getAllFirmsFromCosmos({}, 1, 100);

    const firmPromises = fetchedFirms.firms.map(async (firm) => {
      const fcaNumber = `${firm.fca_number}`;

      const [fcaValidation, irnResults] = await Promise.all([
        validateFcaNumber(fcaNumber),
        validateFirmPrincipals(fcaNumber, firm.principals ?? []),
      ]);

      return {
        fca_number: firm.fca_number,
        fcaValidation,
        principals: irnResults,
      };
    });

    const validationResults = await Promise.all(firmPromises);

    const failures = validationResults.filter(
      (res) =>
        !res.fcaValidation?.valid || res.principals.some((p) => !p.isValid),
    );

    if (failures.length > 0) {
      const summaryForAdmin = failures.map((f) => {
        if (!f.fcaValidation?.valid) {
          return {
            name: f.fcaValidation?.firmName || 'Unknown',
            frn: f.fca_number,
            issue: 'Invalid Firm Status',
          };
        }

        const invalidPrincipals = f.principals.filter((p) => !p.isValid);

        const missingIrns = invalidPrincipals.filter(
          (p) => p.irn === 'N/A' || p.irn === 'Missing',
        ).length;

        const unrecognizedIrns = invalidPrincipals
          .filter((p) => p.irn !== 'N/A' && p.irn !== 'Missing')
          .map((p) => p.irn);

        const issues = [];
        if (missingIrns > 0)
          issues.push(`${missingIrns} missing IRN number(s)`);
        if (unrecognizedIrns.length > 0)
          issues.push(`Invalid IRNs: ${unrecognizedIrns.join(', ')}`);

        return {
          name: f.fcaValidation?.firmName || 'Unknown',
          frn: f.fca_number,
          issue: issues.join(' | '),
        };
      });

      await tidFcaValidationReport(summaryForAdmin);

      console.info('Failures detected:', summaryForAdmin);
    }

    return res.status(200).json({
      success: true,
      totalProcessed: validationResults.length,
      failureCount: failures.length,
    });
  } catch (err) {
    console.error('Error in firm radio submit handler:', err);

    return res
      .status(500)
      .json({ error: 'An error occurred while validating firms' });
  }
}
