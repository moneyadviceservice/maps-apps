import { ageLimitsPath, parseTripCoverStepParams, regionsPath } from '../steps';

export function getAgeLimitsErrorFallbackRoute(
  firmId: string,
  body: Record<string, unknown>,
): string {
  const step = parseTripCoverStepParams(
    String(body.coverArea ?? ''),
    String(body.tripType ?? ''),
  );

  if (step) {
    return ageLimitsPath(firmId, step.coverArea, step.tripType);
  }

  return regionsPath(firmId);
}
