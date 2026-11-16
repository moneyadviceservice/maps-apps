import { STATE_PENSION_WEEKLY_AMOUNT_ID } from 'data/state-pension';
import type { StatePensionData } from 'types/statePension';

const asText = (value: unknown) => (typeof value === 'string' ? value : '');

export const parseStatePensionForm = (
  body: Record<string, unknown>,
): StatePensionData => ({
  weeklyAmount: asText(
    body[STATE_PENSION_WEEKLY_AMOUNT_ID] ?? body.weeklyAmount,
  ),
});
