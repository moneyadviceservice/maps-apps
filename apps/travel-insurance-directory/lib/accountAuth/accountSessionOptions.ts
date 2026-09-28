import { SessionOptions } from 'iron-session';

const SESSION_SECRET = process.env.ACCOUNT_SESSION_SECRET ?? '';

export const accountSessionOptions: SessionOptions = {
  cookieName: 'tid_account_session',
  password: SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};
