/* eslint-disable no-console */

import { UserSession } from '../types';

type LogParams = {
  message: string;
  data?: unknown;
  session?: UserSession;
  url?: string;
};

const formatLog = (
  level: string,
  { message, data, session, url }: LogParams,
): string => {
  const logParts = [`// == [${level}] ===============`, `Message: ${message}`];

  if (url) {
    logParts.push(`URL: ${url}`);
  }

  if (session) {
    logParts.push(`Session: ${JSON.stringify(session, null, 2)}`);
  }

  if (data) {
    logParts.push('Data:', JSON.stringify(data, null, 2));
  }

  return logParts.join('\n');
};

export const logger = {
  log: (params: LogParams): void => {
    console.log(formatLog('LOG', params));
  },

  error: (params: LogParams): void => {
    console.error(formatLog('ERROR', params));
  },

  warn: (params: LogParams): void => {
    console.warn(formatLog('WARN', params));
  },
};
