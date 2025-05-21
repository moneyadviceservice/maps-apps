import crypto from 'crypto';
import { createRemoteJWKSet, jwtVerify, JWTVerifyResult, SignJWT } from 'jose';

const key = new TextEncoder().encode(process.env.ENTRA_CLIENT_SECRET);

const JWKS_URL = 'https://login.microsoftonline.com/common/discovery/v2.0/keys';
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export async function encrypt(
  payload: Record<string, unknown>,
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(
  input: string,
): Promise<JWTVerifyResult<Record<string, unknown>>> {
  const { payload, protectedHeader } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return { payload, protectedHeader };
}

export async function extractUserId(idToken: string): Promise<string | null> {
  const { payload } = await jwtVerify(idToken, JWKS, {
    algorithms: ['RS256'],
  });

  return (payload.sub as string) || null;
}

export const generateCSRFToken = () => crypto.randomBytes(32).toString('hex');
