import { NextApiRequest, NextApiResponse } from 'next';

import { wantsJson } from 'utils/api/wantsJson';

const ERROR_MESSAGE: Record<number, string> = {
  400: 'The request payload is invalid.',
  404: 'No records found.',
  429: 'Too many requests. Please try again later.',
  500: 'An error occurred while making this request. Please try again later.',
  504: 'The request timed out. Please try again later.',
};

const ERROR_TYPE: Record<number, string> = {
  400: 'invalid',
  404: 'notFound',
  429: 'apiError',
  500: 'apiError',
  504: 'apiError',
};

export function returnError(
  res: NextApiResponse,
  req: NextApiRequest,
  pageUrl: string,
  status: number,
  message?: string,
  errorType?: string,
) {
  if (wantsJson(req)) {
    return res.status(status).json({
      statusCode: status,
      errorType: errorType ?? ERROR_TYPE[status] ?? 'unknown',
      message: message ?? ERROR_MESSAGE[status] ?? 'Unexpected error',
    });
  }

  return res.redirect(
    302,
    `${pageUrl}?error=${encodeURIComponent(
      errorType ?? ERROR_TYPE[status] ?? 'unknown',
    )}`,
  );
}
