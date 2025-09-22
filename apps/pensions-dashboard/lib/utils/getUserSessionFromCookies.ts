import Cookies from 'cookies';

import { UserSession } from '../fetch/get-pensions-data';
import { getMhpdSessionConfig } from './sessionConfig';

export const getUserSessionFromCookies = (cookies: Cookies): UserSession => {
  const { userSessionId, authorizationCode, scenarioEndPoint, sessionStart } =
    getMhpdSessionConfig(cookies);

  return {
    userSessionId,
    authorizationCode,
    scenarioEndPoint,
    sessionStart,
  } as UserSession;
};
