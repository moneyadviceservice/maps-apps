export const sessionCookieConfig = {
  password: process.env.SESSION_SECRET ?? '',
  cookieName: process.env.SESSION_NAME ?? '',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};
