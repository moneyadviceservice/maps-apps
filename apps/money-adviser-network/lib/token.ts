import crypto from 'crypto';
import { createRemoteJWKSet, jwtVerify, JWTVerifyResult, SignJWT } from 'jose';

const key = new TextEncoder().encode(process.env.ENTRA_CLIENT_SECRET);

// Use tenant-specific endpoint if you have a specific tenant
const JWKS_URL = process.env.ENTRA_TENANT_ID
  ? `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/discovery/v2.0/keys`
  : 'https://login.microsoftonline.com/common/discovery/v2.0/keys';
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
  try {
    // This should be used for ID tokens that came from Microsoft's OAuth flow
    const { payload: verifiedPayload } = await jwtVerify(idToken, JWKS, {
      algorithms: ['RS256'],
      ...(process.env.ENTRA_TENANT_ID && {
        issuer: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/v2.0`,
      }),
    });

    return (verifiedPayload.sub as string) || null;
  } catch (error) {
    console.error('Failed to verify Microsoft ID token:', error);
    console.error('Error details:', error);
    return null;
  }
}

export const generateCSRFToken = () => crypto.randomBytes(32).toString('hex');
