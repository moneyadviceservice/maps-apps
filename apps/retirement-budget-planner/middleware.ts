import { NextRequest, NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  let sessionId = req.cookies.get('session_id')?.value;
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30, // 30 minutes
      sameSite: 'lax',
    });
  }
  return res;
}
