import type { NextApiRequest, NextApiResponse } from 'next';

import {
  convertCSPReportToString,
  saveDataToBlob,
} from '@maps-react/csp-policy/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body } = req;
  const data = JSON.parse(body);
  const report = data['csp-report'];

  const reportToString = convertCSPReportToString(report);

  try {
    await saveDataToBlob(reportToString);
  } catch (e) {
    throw new Error('Failed to save the CSP report', { cause: e });
  }

  return res.json({ message: 'The CSP report is saved!!' });
}
