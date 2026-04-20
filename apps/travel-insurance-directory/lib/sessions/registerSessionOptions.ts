import { SessionOptions } from 'iron-session';

const REGISTER_SESSION_SECRET = process.env.REGISTER_SESSION_SECRET ?? '';

export const registerSessionOptions: SessionOptions = {
  cookieName: 'tid_register_session',
  password: REGISTER_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};
