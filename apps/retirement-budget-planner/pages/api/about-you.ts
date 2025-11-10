import { NextApiRequest, NextApiResponse } from 'next';

import {
  convertFormData,
  filterFirstPartner,
  findPartnerById,
  PARTNER2,
  partners,
  updatePartners,
} from 'lib/util/about-you';
import { setPartnersInRedis } from 'lib/util/cacheToRedis';
import { getSessionId } from 'lib/util/get-session-id';
import { hasNameError } from 'lib/validation/partner';

function buildBaseQueryParams(sessionId: string) {
  return new URLSearchParams({ sessionId });
}

function setNameErrorIfAny(
  qp: URLSearchParams,
  updatedPartners: typeof partners,
  id?: string | string[],
) {
  const nameError = hasNameError(updatedPartners);
  if (nameError) {
    qp.set('error', 'name');
    qp.set('edit', '1');
    if (id) qp.set('id', id as string);
  } else {
    qp.delete('error');
  }
}

function applyAction(
  action: string | undefined,
  updatedPartners: typeof partners,
): typeof partners {
  switch (action) {
    case 'add': {
      if (!findPartnerById(updatedPartners, 2)) {
        return [...updatedPartners, PARTNER2];
      }
      return updatedPartners;
    }
    case 'remove': {
      return filterFirstPartner(updatedPartners, 2);
    }
    case 'update':
    case 'edit': {
      updatePartners(updatedPartners);
      return updatedPartners;
    }

    default:
      return updatedPartners;
  }
}

async function persistPartners(
  updatedPartners: typeof partners,
  sessionId: string,
) {
  await setPartnersInRedis(updatedPartners, sessionId);
}

function redirectAboutYou(
  res: NextApiResponse,
  qp: URLSearchParams,
  locale = 'en',
) {
  res.redirect(303, `/${locale}/about-you?${qp.toString()}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionId = getSessionId(req.body?.sessionId);
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is missing' });
  }

  const data: any = req.body || req.query;
  const { id } = req.query;
  const action = data?.action as string | undefined;

  let updatedPartners = convertFormData(data);

  const queryParams = buildBaseQueryParams(sessionId);
  setNameErrorIfAny(queryParams, updatedPartners, id as string | undefined);

  updatedPartners = applyAction(action, updatedPartners);

  if (action === 'edit') {
    await persistPartners(updatedPartners, sessionId);
    queryParams.set('edit', '1');
    if (id) queryParams.set('id', id as string);
    return redirectAboutYou(res, queryParams);
  }

  await persistPartners(updatedPartners, sessionId);
  return redirectAboutYou(res, queryParams);
}
