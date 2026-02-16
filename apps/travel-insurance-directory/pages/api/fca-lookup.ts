import { NextApiRequest, NextApiResponse } from 'next';

import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import { IronSessionObject } from 'types/iron-session';

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

interface FcaFirmData {
  Data: {
    firmName?: string;
    FRN?: string;
  }[];
  status?: string;
}

const ERROR_MESSAGES: Record<number, string> = {
  400: 'The FCA Firm Reference Number (FRN) provided is invalid.',
  404: 'No records found for the provided FCA Firm Reference Number (FRN).',
  429: 'Too many requests. Please try again later.',
  500: 'An error occurred while looking up the FCA Firm Reference Number (FRN). Please try again later.',
  504: 'The request timed out. Please try again later.',
};

const ERROR_TYPE: Record<number, string> = {
  400: 'invalid',
  404: 'notFound',
  429: 'apiError',
  500: 'apiError',
  504: 'apiError',
};

function wantsJson(req: NextApiRequest) {
  return req.headers['content-type']?.includes('application/json');
}

function sendError(
  res: NextApiResponse,
  req: NextApiRequest,
  status: number,
  errorType?: string,
  message?: string,
) {
  if (wantsJson(req)) {
    return res.status(status).json({
      statusCode: status,
      errorType: errorType ?? ERROR_TYPE[status] ?? 'unknown',
      message: message ?? ERROR_MESSAGES[status] ?? 'Unexpected error',
    });
  }

  return res.redirect(
    302,
    `/register/step-1?error=${encodeURIComponent(
      errorType ?? ERROR_TYPE[status] ?? 'unknown',
    )}`,
  );
}

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const fcaNumber = req.query.fcaNumber as string;

  if (!fcaNumber) {
    return sendError(res, req, 400, 'required');
  }

  if (!/^\d+$/.test(fcaNumber)) {
    return sendError(res, req, 400);
  }

  try {
    const apiUrl = `${FCA_API_BASE_URL}/Firm/${fcaNumber}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Auth-Key': FCA_API_KEY,
        'X-Auth-Email': FCA_API_EMAIL,
      },
    });

    if (!response.ok) {
      return sendError(res, req, response.status, ERROR_TYPE[response.status]);
    }

    const data: FcaFirmData = await response.json();

    if (!data.Data?.[0]?.FRN) {
      return sendError(res, req, 404);
    }

    req.session.fcaData = {
      firmName: data?.Data[0]?.firmName,
      frnNumber: data?.Data[0]?.FRN,
    };

    await (req.session as IronSessionObject).save();

    if (wantsJson(req)) {
      return res.status(200).json({ success: true });
    }

    return res.redirect(302, `/register/step-2`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return sendError(res, req, 504);
      }
    }

    console.error(error);

    return sendError(res, req, 500);
  }
},
registerSessionOptions);
