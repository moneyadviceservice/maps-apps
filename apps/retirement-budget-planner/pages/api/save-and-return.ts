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

const getDataFromRedis = async (sessionId: string) => {
  try {
    const partnerData = await getPartnersFromRedis(sessionId);
    const incomeData = await getDataFromMemory(sessionId, PAGES_NAMES.INCOME);
    const essentialOutgoings = await getDataFromMemory(
      sessionId,
      PAGES_NAMES.ESSENTIALS,
    );

    //Return with error if it fails to return data from Redis
    if (!partnerData) {
      throw new Error('Failed to retrieve partner data');
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email1, email2, sessionId, language, isJSon } = req.body;

  const { search, pathname } = new URL(req.headers.referer || '');
  const params = new URLSearchParams(search);

  params.delete('error');

  if (!sessionId) {
    if (isJSon)
      return res.status(400).json({ message: 'Session ID is required' });
  }

  const error = validateEmails(email1, email2);

  if (error) {
    if (isJSon)
      res.status(400).json({ message: 'Email validation error', type: error });
    res.redirect(
      303,
      `${pathname}?${params.toString()}&error=${Object.keys(error)
        .join(',')
        .toString()}`,
    );
  }

  //Get data from Redis
  let data = {};

  try {
    data = await getDataFromRedis(sessionId);
    await saveDataToCosmosDB(data, sessionId);
  } catch (error) {
    console.error(error);

    if (isJSon) {
      const errorType =
        typeof error === 'object' && error !== null && 'cause' in error
          ? (error as { cause?: string }).cause
          : undefined;
      res.status(500).json({ type: errorType });
    } else {
      return res.redirect(
        303,
        encodeURI(
          `/${language}/error-page?isEmbedded=${params.get('isEmbedded')}`,
        ),
      );
    }
  }

  params.set('returning', 'true');

  res.redirect(303, `/${language}/progress-saved?${params.toString()}`);
}
