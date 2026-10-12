import crypto from 'crypto';
import { jwtVerify, JWTVerifyResult, SignJWT } from 'jose';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);

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

export const generateCSRFToken = () => crypto.randomBytes(32).toString('hex');
