import Cookies from 'cookies';

export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
} as Cookies.SetOption;
