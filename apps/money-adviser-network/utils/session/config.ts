import Cookies from 'cookies';

export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  priority: 'high',
} as Cookies.SetOption;
