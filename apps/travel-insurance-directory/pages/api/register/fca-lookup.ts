import { NextApiRequest, NextApiResponse } from 'next';

import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import { IronSessionObject } from 'types/iron-session';
import { FcaFirmData } from 'types/register';
import { returnError } from 'utils/api/returnError';
import { wantsJson } from 'utils/api/wantsJson';

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

const FCA_ERROR_MESSAGE: Record<number, string> = {
  400: 'The FCA Firm Reference Number (FRN) provided is invalid.',
  404: 'No records found for the provided FCA Firm Reference Number (FRN).',
  500: 'An error occurred while looking up the FCA Firm Reference Number (FRN). Please try again later.',
};

const pageUrl = '/register/fca';
const NEXT_STEP_URL = '/register/user';

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const fcaNumber = req.query.fcaNumber as string;

  if (!fcaNumber) {
    return returnError(
      res,
      req,
      pageUrl,
      400,
      FCA_ERROR_MESSAGE[400],
      'required',
    );
  }

  if (!/^\d+$/.test(fcaNumber)) {
    return returnError(res, req, pageUrl, 400, FCA_ERROR_MESSAGE[400]);
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
      return returnError(res, req, pageUrl, response.status);
    }

    const data: FcaFirmData = await response.json();

    if (!data.Data?.[0]?.FRN) {
      return returnError(res, req, pageUrl, 404, FCA_ERROR_MESSAGE[404]);
    }
    if (data.Data?.[0]?.Status !== 'Authorised') {
      return returnError(res, req, pageUrl, 400, FCA_ERROR_MESSAGE[400]);
    }

    req.session.fcaData = {
      firmName: data?.Data[0]?.firmName,
      frnNumber: data?.Data[0]?.FRN,
    };

    await (req.session as IronSessionObject).save();

    if (wantsJson(req)) {
      return res.status(200).json({ success: true });
    }

    return res.redirect(302, NEXT_STEP_URL);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return returnError(res, req, pageUrl, 504);
      }
    }

    console.error(error);

    return returnError(res, req, pageUrl, 500, FCA_ERROR_MESSAGE[500]);
  }
},
registerSessionOptions);
