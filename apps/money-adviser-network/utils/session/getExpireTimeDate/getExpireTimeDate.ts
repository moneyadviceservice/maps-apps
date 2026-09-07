export function getExpireTimeDate(time: number) {
  const now = new Date();
  return new Date(now.getTime() + time * 60 * 1000);
}
