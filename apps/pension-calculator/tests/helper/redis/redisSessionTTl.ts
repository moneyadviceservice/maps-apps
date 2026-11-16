const redisTtl = process.env.REDIS_SESSION_TTL;

export const redisTtlMock = {
  ttlSeconds: redisTtl ? Number(redisTtl) : undefined,
};
