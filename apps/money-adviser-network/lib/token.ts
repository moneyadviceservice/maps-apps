import { JWTVerifyResult, SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.SECRET_KEY);

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
