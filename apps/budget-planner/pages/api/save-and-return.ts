import type { NextApiRequest, NextApiResponse } from 'next';

import crypto from 'crypto';
import { BudgetData, insertBudgetData } from 'lib/dbInsert';
import { updateBudgetData } from 'lib/dbUpdate';
import { NotifyClient } from 'notifications-node-client';
import { v4 as uuidv4 } from 'uuid';

import { validateEmail } from '@maps-react/utils/validateEmail';

type Props = {
  message?: string;
  data?: { [key: string]: Record<string, string> };
  sessionId?: string;
};

const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);

/**
 * Creates a SHA-256 hash of the email address
 * @param email - The email address to hash
 * @returns The hexadecimal hash of the email
 */
const hashEmail = (email: string): string => {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
};

/**
 * @param data
 * @param sessionId
 * @param emailHash
 * @returns a Promise of the data saved in the database or an error message and the cause of the error
 */
const saveToDB = async (
  data: { [key: string]: Record<string, string> },
  sessionId?: string,
  emailHash?: string,
): Promise<Props> => {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  const budgetData: BudgetData = {
    sessionId:
      sessionId === '' || sessionId == null
        ? uuidv4().replace(/-/g, '')
        : sessionId,
    emailHash: emailHash ?? '',
    lastAccessed: new Date(),
    income: data.income,
    'household-bills': data['household-bills'],
    'living-costs': data['living-costs'],
    'finance-insurance': data['finance-insurance'],
    'family-friends': data['family-friends'],
    travel: data['travel'],
    leisure: data['leisure'],
  };

  try {
    if (sessionId) {
      const update = await updateBudgetData(sessionId, budgetData);
      if (!update) {
        throw new Error('Failed to save the data in the database');
      }
      return { data, sessionId: update.sessionId };
    } else {
      const insert = await insertBudgetData(budgetData);

      if (!insert) {
        throw new Error('Failed to insert data into the database');
      }
      return {
        data,
        message: 'Successfully saved the data in the database',
        sessionId: insert.sessionId,
      };
    }
  } catch (error) {
    console.error('Error saving data to the database:', error);
    throw new Error('Failed to save/update the data in the database');
  }
};
/**
 *
 * @param email
 * @param sessionId
 * @param language
 * @param tabName
 * @param host
 * @param baseUrl
 * @returns a Promise of the email sent to the user
 */
const sendEmail = async (
  email: string,
  sessionId: string,
  language: string,
  tabName: string,
  host: string | undefined,
): Promise<any> => {
  if (!host) {
    return;
  }
  const linkText =
    language === 'cy'
      ? 'Ailddechrau Cynlluniwr Cyllideb'
      : 'Resume Budget planner';
  const link = `[${linkText}](${host}/${language}/${tabName}?returning=true&sessionID=${sessionId})`;
  const templateId =
    language === 'cy'
      ? process.env.NOTIFY_TEMPLATE_ID_CY
      : process.env.NOTIFY_TEMPLATE_ID;
  return notifyClient.sendEmail(templateId, email, {
    personalisation: {
      save_return_link: link,
    },
    reference: null,
  });
};

/**
 * Update the query parameters
 * @param params
 * @param add
 * @param del
 */
const updateParams = (
  params: URLSearchParams,
  add: { key: string; value: string }[],
  del: { key: string; value: string }[],
) => {
  del.forEach(({ key }) => {
    params.delete(key);
  });

  add.forEach(({ key, value }) => {
    if (value) params.set(key, value);
  });
};

/**
 * Send an email to the user with a link to return to the budget planner with their data.
 *
 * @param request - the request object
 * @param response - the response object
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<Props | void> {
  const {
    body,
    headers: { referer },
    query: { sessionID, isJsonRes },
  } = request;

  let language: string,
    email: string,
    userData: { [key: string]: Record<string, string> },
    tabName: string;
  if (typeof body === 'string') {
    ({ language, email, userData, tabName } = JSON.parse(body));
  } else {
    ({ language, email, userData, tabName } = body);
  }

  const { search, pathname } = new URL(referer ?? '');
  const params = new URLSearchParams(search);

  /**
   * Validate the email address
   * if the email address is invalid, return an json object with message
   * and pass the error to the client when js is on or
   * redirect to the same page with error query when js is off
   */
  if (!validateEmail(email)) {
    updateParams(
      params,
      [
        { key: 'error', value: 'email' },
        { key: 'sessionID', value: sessionID?.toString() ?? '' },
      ],
      [{ key: 'error', value: 'database' }],
    );
    if (isJsonRes) {
      return response.status(302).json({
        message: 'email is invalid',
        cause: 'email',
        sessionID,
      });
    } else {
      response.redirect(302, `${pathname}?${params.toString()}`);
      return;
    }
  }

  try {
    const emailHash = hashEmail(email);
    saveToDB(userData, sessionID?.toString(), emailHash)
      .then((dbresponse) => {
        if (!dbresponse) {
          updateParams(
            params,
            [
              { key: 'error', value: 'database' },
              { key: 'sessionID', value: sessionID?.toString() ?? '' },
            ],
            [{ key: 'error', value: 'email' }],
          );
          if (isJsonRes)
            return response.status(500).json({
              message: 'Failed to save the data in the database',
              cause: 'database',
              sessionID: sessionID?.toString(),
            });
          else {
            response.redirect(
              302,
              `/${language}/error-page?${params.toString()}`,
            );
            return;
          }
        }
        if (dbresponse?.sessionId) {
          sendEmail(
            email,
            dbresponse?.sessionId,
            language,
            tabName,
            request.headers.origin,
          )
            .then((res) => {
              if (res.status === 201) {
                updateParams(
                  params,
                  [
                    { key: 'returning', value: 'true' },
                    { key: 'tabName', value: tabName },
                    { key: 'sessionID', value: dbresponse.sessionId ?? '' },
                  ],
                  [
                    { key: 'error', value: 'database' },
                    { key: 'error', value: 'email' },
                  ],
                );
                if (isJsonRes)
                  return response.status(200).json({
                    message: 'Successfully saved the data in the database',
                    data: dbresponse?.data,
                    sessionID: dbresponse?.sessionId,
                  });
                else
                  response.redirect(
                    302,
                    `/${language}/progress-saved${
                      params.toString() ? `?${params.toString()}` : ''
                    }`,
                  );
              }
            })
            .catch(() => {
              updateParams(
                params,
                [
                  { key: 'error', value: 'database' },
                  { key: 'sessionID', value: sessionID?.toString() ?? '' },
                ],
                [{ key: 'error', value: 'email' }],
              );
              if (isJsonRes)
                return response.status(500).json({
                  message: 'Failed to send the email to the user',
                  data: userData,
                  cause: 'email',
                  sessionID: sessionID?.toString(),
                });
              else {
                response.redirect(
                  302,
                  `/${language}/error-page?${params.toString()}`,
                );
              }
            });
        }
      })
      .catch((error) => {
        updateParams(
          params,
          [
            { key: 'error', value: 'database' },
            { key: 'sessionID', value: sessionID?.toString() ?? '' },
          ],
          [{ key: 'error', value: 'email' }],
        );

        if (isJsonRes)
          return response.status(302).json({
            message: error.message,
            data: userData,
            cause: 'database',
            sessionID: sessionID?.toString(),
          });
        else {
          response.redirect(
            302,
            `/${language}/error-page?${params.toString()}`,
          );
        }
      });
    // eslint-disable-next-line no-empty
  } catch (error) {
    console.error('Error in save-and-return API:', error);
  }
}
