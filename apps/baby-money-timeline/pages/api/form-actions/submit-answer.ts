import { NextApiRequest, NextApiResponse } from 'next';

import {
  isBeforeMinDate,
  isValidDate,
} from '../../../utils/validation/dateValidation/dateValidation';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { day, month, year, language } = req.body;

  const formattedDate = `${day || ''}-${month || ''}-${year || ''}`;

  const hasEmptyFields = !day || !month || !year;

  const errorRedirect = () =>
    res.redirect(303, `/${language}?dueDate=${formattedDate}&error=dueDate`);

  if (
    hasEmptyFields ||
    isBeforeMinDate(formattedDate) ||
    !isValidDate(formattedDate)
  ) {
    return errorRedirect();
  }

  return res.redirect(303, `/${language}/1?dueDate=${formattedDate}`);
}
