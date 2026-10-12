import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { checkSessionValidity } from 'utils/session/checkSessionValidity';
import { COOKIE_OPTIONS } from 'utils/session/config';
import { z } from 'zod';

import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { rateLimitMiddleware } from '@maps-react/utils/rateLimitMiddleware';
import { withFetchLock } from '@maps-react/utils/withFetchLock';

import { PAGES } from '../../CONSTANTS';
import { FORM_FIELDS } from '../../data/questions/types';
import { decrypt, encrypt } from '../../lib/token';
import { getCurrentPath } from '../../utils/getCurrentPath';
import { FLOW } from '../../utils/getQuestions';
import { getSlot } from './utils/getSlot/getSlot';
import { handleBookingErrors } from './utils/handleBookingErrors';

type ParsedResponse = {
  urlData: string;
  cookieData: string;
  language: string;
  currentFlow: FLOW;
  csrfToken?: string;
};

type Slot = {
  slotType?: string;
  formattedSlotDate?: string;
  error?: string;
};

export type User = {
  referrerId: string;
  organisationConfirmed?: boolean;
  organisationName?: string;
  expires?: Date;
};

type ContactDetails = {
  contactfirstname: string;
  contactlastname: string;
  phone: string;
  contactemail: string;
  creditorreferencenumber: string;
  agentdepartmentname: string;
  referrerusername: string;
};

type CaseDetails = {
  securityquestion1: string;
  securityquestion1answer: string;
  securityquestion2: string;
  securityquestion2answer: string;
  consenttocaptureandstoredata: boolean;
  consenttofeedback: boolean;
};

type AppointmentPayload = {
  slottype?: string;
  slot: string;
  webformlink: string;
  source: string;
  contact: ContactDetails;
  case: CaseDetails;
};

const requestBodySchema = z.object({
  urlData: z.string().optional(),
  cookieData: z.string().optional(),
  language: z.string().min(2).max(2),
  currentFlow: z.string(),
  csrfToken: z.string().min(32, 'Invalid CSRF token'),
});

const missingParamsError = (api?: string, code?: string) => {
  const missingParams = [];
  if (!api) missingParams.push('APPOINTMENTS_API');
  if (!code) missingParams.push('BOOK_APPOINTMENT_SLOT_CODE');
  return `Missing required parameter(s): ${missingParams.join(', ')}`;
};

const parseRequestBody = (req: NextApiRequest): ParsedResponse | Error => {
  const parsedBody = requestBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    return new Error('Invalid request format');
  }
  return parsedBody.data as ParsedResponse;
};

const parseJsonSafely = (data: string | undefined, res: NextApiResponse) => {
  try {
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('JSON parsing error:', error);
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
};

export const getUserFromCookies = async (
  req: NextApiRequest,
): Promise<User | { error: string }> => {
  if (!req.cookies.session) {
    return { error: 'No session' };
  }
  try {
    const session = await decrypt(req.cookies.session);
    const isSessionValid = await checkSessionValidity(session);
    if (!isSessionValid) {
      return { error: 'Invalid user session' };
    }

    return session.payload as User;
  } catch (error) {
    console.error('User decryption error:', error);
    return { error: 'Invalid user session' };
  }
};

export const invalidateSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userSession: User,
) => {
  delete userSession['organisationName'];
  const newSession = await encrypt({ userSession });

  const cookies = new Cookies(req, res);
  cookies.set('session', newSession, {
    ...COOKIE_OPTIONS,
    expires: userSession.expires,
  });

  return 'success';
};

const createPayload = (
  parsedCookieData: DataFromQuery,
  slot: Slot,
  user: User,
  isOnlineFlow: boolean,
): AppointmentPayload => {
  const {
    customerDetails,
    reference,
    securityQuestions,
    consentOnline,
    consentDetails,
    consentReferral,
  } = parsedCookieData;

  return {
    slottype: slot.slotType,
    slot: slot?.formattedSlotDate ?? '',
    webformlink:
      'https://money-adviser-network.moneyhelper.org.uk/en/telephone',
    source: 'webform',
    contact: {
      contactfirstname: customerDetails?.[FORM_FIELDS.firstName] ?? '',
      contactlastname: customerDetails?.[FORM_FIELDS.lastName] ?? '',
      phone: customerDetails?.[FORM_FIELDS.telephone] ?? '',
      contactemail: customerDetails?.[FORM_FIELDS.email] ?? '',
      creditorreferencenumber: reference?.[FORM_FIELDS.customerReference] ?? '',
      agentdepartmentname: reference?.[FORM_FIELDS.departmentName] ?? '',
      referrerusername: user?.organisationName ?? '',
    },
    case: {
      securityquestion1:
        securityQuestions?.[FORM_FIELDS.securityQuestion] ?? '',
      securityquestion1answer:
        securityQuestions?.[FORM_FIELDS.securityAnswer] ?? '',
      securityquestion2: isOnlineFlow ? '' : 'What is your postcode?',
      securityquestion2answer: securityQuestions?.[FORM_FIELDS.postcode] ?? '',
      consenttocaptureandstoredata: isOnlineFlow
        ? consentOnline?.value === '0'
        : consentDetails?.value === '0',
      consenttofeedback: consentReferral?.value === '0',
    },
  };
};

const handleApiResponse = async (
  api: string,
  code: string,
  payload: AppointmentPayload,
  res: NextApiResponse,
  pagePath: string,
  parsedUrlData: DataFromQuery,
  isOnlineFlow: boolean,
  correlationId: string,
) => {
  try {
    const response = await withFetchLock(correlationId, () =>
      fetch(`${api}BookAppointment?code=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
        },
        body: JSON.stringify(payload),
      }),
    );

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const telNextPage =
      payload.slottype === 'IMMEDIATE'
        ? PAGES.IMMEDIATE_CONFIRMATION
        : PAGES.CALL_SCHEDULED;
    const nextPage = isOnlineFlow ? PAGES.DETAILS_SENT : telNextPage;

    return res.redirect(302, `/${pagePath}/${nextPage}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred.';
    console.error(errorMessage);
    return handleBookingErrors(errorMessage, res, pagePath, parsedUrlData);
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { urlData, cookieData, language, currentFlow, csrfToken } =
    parseRequestBody(req) as ParsedResponse;
  const csrfTokenFromCookie = req.cookies.csrfToken;

  if (!csrfToken || csrfToken !== csrfTokenFromCookie) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  const isOnlineFlow = currentFlow === FLOW.ONLINE;

  const { BOOK_APPOINTMENT_SLOT_CODE: code, APPOINTMENTS_API: api } =
    process.env;
  if (!api || !code) {
    return res.status(400).json({ error: missingParamsError(api, code) });
  }

  const parsedUrlData = parseJsonSafely(urlData, res);
  const parsedCookieData = parseJsonSafely(cookieData, res);

  const currentPath = getCurrentPath(currentFlow);
  const pagePath = `${language}/${currentPath}`;
  const rawSlot = parsedCookieData['timeSlot']?.value;
  const overrideOfficeHours = parsedUrlData['test'] === 'immediate';
  const slot = getSlot(rawSlot, isOnlineFlow, overrideOfficeHours);

  if (slot.error) {
    return handleBookingErrors(slot.error, res, pagePath, parsedUrlData);
  }

  const userSession = (await getUserFromCookies(req)) as User;
  if ('error' in userSession && userSession.error) {
    await invalidateSession(req, res, userSession);

    return handleBookingErrors(
      'Invalid user session',
      res,
      pagePath,
      parsedUrlData,
    );
  } else {
    const correlationId = req.cookies.correlationId ?? '';
    const payload = createPayload(
      parsedCookieData,
      slot,
      userSession,
      isOnlineFlow,
    );

    await handleApiResponse(
      api,
      code,
      payload,
      res,
      pagePath,
      parsedUrlData,
      isOnlineFlow,
      correlationId,
    );
  }
}

export default rateLimitMiddleware(handler, 10);
