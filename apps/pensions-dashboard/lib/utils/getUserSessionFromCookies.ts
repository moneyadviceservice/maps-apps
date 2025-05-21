import Cookies from 'cookies';

import { UserSession } from '../fetch/get-pensions-data';

export const getUserSessionFromCookies = (cookies: Cookies) => {
  return {
    userSessionId: cookies.get('userSessionId') ?? '',
    authorizationCode: cookies.get('authorizationCode') ?? '',
    scenarioEndPoint: cookies.get('scenarioEndPoint') ?? '',
  } as UserSession;
};
