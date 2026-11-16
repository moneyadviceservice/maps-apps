export function shouldEnforceUniqueFcaNumber(): boolean {
  return process.env.ENVIRONMENT === 'production';
}
