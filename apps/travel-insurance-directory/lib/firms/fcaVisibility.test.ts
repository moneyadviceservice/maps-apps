import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
  isListedOnPublicDirectory,
} from './fcaVisibility';

describe('isListedOnPublicDirectory', () => {
  describe('AC 1: Blocked State — public-facing search', () => {
    // AC 1: And the firm record must be entirely hidden from public-facing search results.
    it('hides a firm with status hidden / Invalid_FCA from public search', () => {
      expect(
        isListedOnPublicDirectory({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      ).toBe(false);
    });
  });

  describe('AC 2: Firm hidden due to AC 1 — FRN valid again', () => {
    // AC 2: Then the firm must be visible in public-facing search results.
    it('lists the firm again once status is active and Invalid_FCA is cleared', () => {
      expect(
        isListedOnPublicDirectory({
          status: 'active',
          hidden_reason: null,
        }),
      ).toBe(true);
    });
  });

  describe('AC 3 / AC 4: trading name no longer current — public search', () => {
    // AC 3: hidden from the public record/search. AC 4: Cosmos status remains hidden.
    it('hides a trading name with Trading_name-Inactive_or_Not_Current from public search', () => {
      expect(
        isListedOnPublicDirectory({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
        }),
      ).toBe(false);
    });
  });
});
