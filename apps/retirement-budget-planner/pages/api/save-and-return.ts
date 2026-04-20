import { NextApiRequest, NextApiResponse } from 'next';

import { ERROR_TYPES } from 'lib/constants/constants';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { getDataFromMemory, getPartnersFromRedis } from 'lib/util/cacheToRedis';
import {
  databaseClient,
  saveEntry,
  searchById,
} from 'lib/util/databaseConnect';
import { updateEntry } from 'lib/util/databaseConnect/updateEntry';
import { validateEmails } from 'lib/validation/emailValidation';
import { NotifyClient } from 'notifications-node-client';

const saveDataToCosmosDB = async (
  data: Record<string, any>,
  sessionId: string,
) => {
  try {
    const dbContainer = await databaseClient();

    //Find if it is an existing entry
    const existing = await searchById(dbContainer, sessionId);

    if (existing && Object.keys(existing).length > 0) {
      await updateEntry(dbContainer, data, sessionId);
    } else {
      await saveEntry(dbContainer, data, sessionId);
    }
  } catch (error) {
    throw new Error(`${error}`, { cause: ERROR_TYPES.API_CALL_FAILED });
  }
};

const sendEmail = async (
  lang: string,
  host: string,
  params: URLSearchParams,
  email: string,
  urn: string,
) => {
  const lastTab = params.get('tabName');
  const returnLink = `${host}/${lang}/${lastTab}?${params.toString()}`;

  const template =
    lang === 'en'
      ? process.env.NOTIFY_TEMPLATE_ID_EN
      : process.env.NOTIFY_TEMPLATE_ID_CY;

  try {
    const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
    await notifyClient.sendEmail(template, email, {
      personalisation: {
        save_return_link: returnLink,
        urnRef: urn,
      },
      reference: null,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send the email', {
      cause: ERROR_TYPES.NOTIFY_ERROR,
    });
  }
};

const getDataFromRedis = async (sessionId: string) => {
  try {
    const partnerData = await getPartnersFromRedis(sessionId);
    const incomeData = await getDataFromMemory(sessionId, PAGES_NAMES.INCOME);
    const essentialOutgoings = await getDataFromMemory(
      sessionId,
      PAGES_NAMES.ESSENTIALS,
    );

    //Return with error if it fails to return data from Redis
    if (!partnerData || (!partnerData.gender && !partnerData.retireAge)) {
      throw new Error('Failed to retrieve partner data', {
        cause: ERROR_TYPES.SESSION_EXPIRED,
      });
    }

    return {
      about: partnerData,
      ...(incomeData ? { income: incomeData } : {}),
      ...(essentialOutgoings ? { outgoings: essentialOutgoings } : {}),
    };
  } catch (error) {
    throw new Error(`${error}`, { cause: ERROR_TYPES.SESSION_EXPIRED });
  }
};

const validateSession = (sessionid: string, isJSon: boolean) =>
  !sessionid && isJSon;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email, sessionId, language, isJSon } = req.body;

  const { search, pathname, host, protocol } = new URL(
    req.headers.referer || '',
  );

  const params = new URLSearchParams(search);

  params.delete('error');
  let path = null;
  if (validateSession(sessionId, isJSon)) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  const error = validateEmails(email);

  if (error) {
    if (isJSon)
      return res
        .status(400)
        .json({ message: 'Email validation error', type: error });
    else {
      console.error('Email validation failed');
      path = `${pathname}?${params.toString()}&error=${Object.keys(error)
        .join(',')
        .toString()}`;
    }
  } else {
    try {
      const data = await getDataFromRedis(sessionId);
      await saveDataToCosmosDB(data, sessionId);
      params.set('returning', 'true');

      await sendEmail(
        language,
        `${protocol}//${host}`,
        params,
        email,
        params.get('urn') || '',
      );
    } catch (err) {
      console.error(err);

      if (isJSon) {
        const errorType = (err as Error)?.cause;
        return res.status(500).json({ type: errorType });
      } else {
        path = encodeURI(
          `/${language}/error-page?isEmbedded=${params.get('isEmbedded')}`,
        );
      }
    }
  }

  params.delete('returning');

  if (isJSon) return res.status(200).json('Data saved successfully');
  if (!path) path = `/${language}/progress-saved?${params.toString()}`;
  res.redirect(303, path);
}
