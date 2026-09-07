import {
  hasLapsedRegistrationEmailBeenSent,
  hasRegWindowStartEmailBeenSent,
  hasReregistrationLapsed,
  isInRenewalWindow,
} from 'lib/account/reregistrationState';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
  isHiddenDueToFcaInvalidation,
  validateReRegistration,
} from './helpers';

jest.mock('lib/account/reregistrationState', () => ({
  isInRenewalWindow: jest.fn(),
  hasRegWindowStartEmailBeenSent: jest.fn(),
  hasReregistrationLapsed: jest.fn(),
  hasLapsedRegistrationEmailBeenSent: jest.fn(),
}));

const createMockFirm = (
  overrides: Partial<TravelInsuranceFirmDocument> = {},
): TravelInsuranceFirmDocument =>
  ({
    fca_number: 123456,
    registered_name: 'Test Firm Ltd',
    status: 'active',
    hidden_reason: null,
    ...overrides,
  } as TravelInsuranceFirmDocument);

describe('firm-helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isHiddenDueToFcaInvalidation', () => {
    it('returns true when reason is HIDDEN_DUE_TO_FCA even if status is active', () => {
      const firm = createMockFirm({
        status: 'active',
        hidden_reason: HIDDEN_DUE_TO_FCA,
      });

      expect(isHiddenDueToFcaInvalidation(firm)).toBe(true);
    });

    it('returns true when hidden_reason is HIDDEN_DUE_TO_TRADING_NAME, regardless of status', () => {
      const firm = createMockFirm({
        status: 'active',
        hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
      });

      expect(isHiddenDueToFcaInvalidation(firm)).toBe(true);
    });

    it('returns false when status is "hidden" but for an unrelated reason', () => {
      const firm = createMockFirm({
        status: 'hidden',
        hidden_reason: 'reregistration_required',
      });

      expect(isHiddenDueToFcaInvalidation(firm)).toBe(false);
    });

    it('returns false when firm is active with no hidden reason', () => {
      const firm = createMockFirm({
        status: 'active',
        hidden_reason: null,
      });

      expect(isHiddenDueToFcaInvalidation(firm)).toBe(false);
    });
  });

  describe('validateReRegistration', () => {
    it('maps all reregistration checks accurately to the return object', () => {
      (isInRenewalWindow as jest.Mock).mockReturnValue(true);
      (hasRegWindowStartEmailBeenSent as jest.Mock).mockReturnValue(false);
      (hasReregistrationLapsed as jest.Mock).mockReturnValue(true);
      (hasLapsedRegistrationEmailBeenSent as jest.Mock).mockReturnValue(false);

      const mockFirm = createMockFirm();

      const result = validateReRegistration(mockFirm);

      expect(result).toEqual({
        isWithinRenewalWindow: true,
        hasWindowStartEmailBeenSent: false,
        reregistrationHasLapsed: true,
        hasSentLapsedEmail: false,
      });

      expect(isInRenewalWindow).toHaveBeenCalledWith(mockFirm);
      expect(hasRegWindowStartEmailBeenSent).toHaveBeenCalledWith(mockFirm);
      expect(hasReregistrationLapsed).toHaveBeenCalledWith(mockFirm);
      expect(hasLapsedRegistrationEmailBeenSent).toHaveBeenCalledWith(mockFirm);
    });
  });
});
