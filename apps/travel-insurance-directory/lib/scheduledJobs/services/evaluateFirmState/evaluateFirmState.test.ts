import { getPrincipal } from 'lib/firms/firmDocument';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
  validateReRegistration,
} from 'lib/scheduledJobs/helpers';
import { validateFcaNumber } from 'lib/validate-firms/validate-fca';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import {
  evaluateFirmState,
  indexTradingFirmsByMainFirmId,
} from './evaluateFirmState';

jest.mock('lib/firms/firmDocument', () => ({
  getPrincipal: jest.fn(),
  isMainFirm: (firm: TravelInsuranceFirmDocument) => firm.type === 'main',
}));

jest.mock('lib/validate-firms/validate-fca', () => ({
  validateFcaNumber: jest.fn(),
}));

jest.mock('lib/scheduledJobs/helpers', () => {
  const HIDDEN_DUE_TO_FCA = 'Invalid_FCA';
  const HIDDEN_DUE_TO_TRADING_NAME = 'Trading_name-Inactive_or_Not_Current';
  return {
    HIDDEN_DUE_TO_FCA,
    HIDDEN_DUE_TO_TRADING_NAME,
    hasFcaVisibilityBlock: (firm: TravelInsuranceFirmDocument) =>
      firm.hidden_reason === HIDDEN_DUE_TO_FCA ||
      firm.hidden_reason === HIDDEN_DUE_TO_TRADING_NAME,
    validateReRegistration: jest.fn(),
  };
});

const createMockFirm = (
  overrides: Partial<TravelInsuranceFirmDocument> = {},
): TravelInsuranceFirmDocument =>
  ({
    id: 'firm-123',
    fca_number: 123456,
    registered_name: 'Acme Advisory',
    status: 'active',
    type: 'main',
    hidden_reason: null,
    reRegistrationLogs: {},
    ...overrides,
  } as TravelInsuranceFirmDocument);

const createDefaultReRegChecks = () => ({
  isWithinRenewalWindow: false,
  hasWindowStartEmailBeenSent: false,
  reregistrationHasLapsed: false,
  hasSentLapsedEmail: false,
});

const mockFcaInvalid = () =>
  (validateFcaNumber as jest.Mock).mockResolvedValueOnce({ valid: false });

const mockFcaValid = (tradingNames: string[] = ['Acme Advisory']) =>
  (validateFcaNumber as jest.Mock).mockResolvedValueOnce({
    valid: true,
    firmName: 'Acme Advisory FCA',
    tradingNames,
  });

describe('evaluateFirmState', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (validateFcaNumber as jest.Mock).mockResolvedValue({
      valid: true,
      firmName: 'Acme Advisory FCA',
      tradingNames: ['Acme Advisory'],
    });

    (validateReRegistration as jest.Mock).mockReturnValue(
      createDefaultReRegChecks(),
    );
    (getPrincipal as jest.Mock).mockReturnValue({
      first_name: 'Alice',
      email_address: 'alice@example.com',
    });
  });

  describe('AC 1: Blocked State (Regulatory Hard-Stops)', () => {
    // AC 1: Then the system must set that firm’s status to hidden with reason Invalid_FCA.
    it('sets the firm to hidden with reason Invalid_FCA when FCA is not approved', async () => {
      mockFcaInvalid();

      const result = await evaluateFirmState(
        createMockFirm({ status: 'active' }),
      );

      expect(result.firmUpdates).toEqual({
        status: 'hidden',
        hidden_reason: HIDDEN_DUE_TO_FCA,
      });
      expect(result.failure?.issue).toBe('Invalid Parent Firm Status');
    });

    // AC 1: And linked trading names that are currently active must also be set to hidden / Invalid_FCA.
    it('hides currently active linked trading names as Invalid_FCA', async () => {
      mockFcaInvalid();
      const tradingFirmsByMainFirmId = new Map([
        [
          'firm-123',
          [
            { id: 'trading-active', status: 'active', hidden_reason: null },
          ] as TravelInsuranceFirmDocument[],
        ],
      ]);

      const result = await evaluateFirmState(createMockFirm(), {
        tradingFirmsByMainFirmId,
      });

      expect(result.relatedFirmUpdates).toEqual([
        {
          id: 'trading-active',
          updates: {
            status: 'hidden',
            hidden_reason: HIDDEN_DUE_TO_FCA,
          },
        },
      ]);
    });

    // AC 1: And if a trading name is already hidden for another reason, the sync must not overwrite that hide.
    it('does not overwrite a linked trading name already hidden for another reason', async () => {
      mockFcaInvalid();
      const tradingFirmsByMainFirmId = new Map([
        [
          'firm-123',
          [
            {
              id: 'trading-rereg',
              status: 'hidden',
              hidden_reason: 'reregistration_required',
            },
            {
              id: 'trading-fca',
              status: 'hidden',
              hidden_reason: HIDDEN_DUE_TO_FCA,
            },
          ] as TravelInsuranceFirmDocument[],
        ],
      ]);

      const result = await evaluateFirmState(createMockFirm(), {
        tradingFirmsByMainFirmId,
      });

      expect(result.relatedFirmUpdates).toEqual([]);
    });

    // AC 1: And the principal must receive an Invalid FRN email (once, on first hide only).
    it('emails the principal Invalid FRN on first hide only', async () => {
      mockFcaInvalid();

      const result = await evaluateFirmState(
        createMockFirm({ status: 'active' }),
      );

      expect(result.notifyTarget).toEqual({
        firstName: 'Alice',
        email: 'alice@example.com',
        emailTemplate: 'tidInvalidFrn',
      });
    });

    // AC 1: Invalid FRN email once, on first hide only — already Invalid_FCA must not patch or email again.
    it('does not email or re-hide when already hidden for Invalid_FCA', async () => {
      mockFcaInvalid();

      const result = await evaluateFirmState(
        createMockFirm({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      );

      expect(result.firmUpdates).toEqual({});
      expect(result.notifyTarget).toBeNull();
      expect(result.isParentInvalid).toBe(true);
    });

    // AC 1: And if the firm is already hidden for another reason (e.g. re-registration), do not overwrite or email.
    it('does not overwrite a firm already hidden for another reason or send another email', async () => {
      mockFcaInvalid();

      const result = await evaluateFirmState(
        createMockFirm({
          status: 'hidden',
          hidden_reason: 'reregistration_required',
        }),
      );

      expect(result.firmUpdates).toEqual({});
      expect(result.notifyTarget).toBeNull();
    });

    // AC 1: linked trading names are also hidden / Invalid_FCA when the parent FRN is a hard-stop.
    it('hides a trading-name document as Invalid_FCA when its parent FRN is invalid', async () => {
      mockFcaInvalid();

      const result = await evaluateFirmState(
        createMockFirm({ type: 'trading', status: 'active' }),
      );

      expect(result.firmUpdates).toEqual({
        status: 'hidden',
        hidden_reason: HIDDEN_DUE_TO_FCA,
      });
      expect(result.relatedFirmUpdates).toEqual([]);
      expect(result.isParentInvalid).toBe(false);
      expect(result.notifyTarget).toBeNull();
    });

    // AC 1 (edge): Invalid FRN email is not sent if principal contact details are missing.
    it('does not email when principal contact details are missing', async () => {
      mockFcaInvalid();
      (getPrincipal as jest.Mock).mockReturnValueOnce(null);

      const result = await evaluateFirmState(createMockFirm());

      expect(result.notifyTarget).toBeNull();
    });

    // AC 1 (edge): failure log still records the hard-stop when registered_name is missing.
    it('uses the FCA firm name in the failure log when registered_name is missing', async () => {
      (validateFcaNumber as jest.Mock).mockResolvedValueOnce({
        valid: false,
        firmName: 'Fallback Name',
      });

      const result = await evaluateFirmState(
        createMockFirm({ registered_name: undefined }),
      );

      expect(result.failure?.name).toBe('Fallback Name');
    });
  });

  describe('AC 2: Firm hidden due to AC 1 — FRN valid again', () => {
    // AC 2: Then the firm must be set back to active (hidden reason cleared).
    it('sets the firm back to active and clears Invalid_FCA', async () => {
      const result = await evaluateFirmState(
        createMockFirm({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      );

      expect(result.firmUpdates).toEqual({
        status: 'active',
        hidden_reason: null,
      });
    });

    // AC 2: And linked trading names hidden only for Invalid_FCA must also be restored to active.
    it('restores linked trading names hidden only for Invalid_FCA', async () => {
      const tradingFirmsByMainFirmId = new Map([
        [
          'firm-123',
          [
            {
              id: 'trading-fca',
              status: 'hidden',
              hidden_reason: HIDDEN_DUE_TO_FCA,
            },
          ] as TravelInsuranceFirmDocument[],
        ],
      ]);

      const result = await evaluateFirmState(
        createMockFirm({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
        { tradingFirmsByMainFirmId },
      );

      expect(result.relatedFirmUpdates).toEqual([
        {
          id: 'trading-fca',
          updates: {
            status: 'active',
            hidden_reason: null,
          },
        },
      ]);
    });

    // AC 2: And firms (or trading names) hidden for another reason must stay hidden.
    it('leaves trading names hidden for another reason hidden', async () => {
      const tradingFirmsByMainFirmId = new Map([
        [
          'firm-123',
          [
            {
              id: 'trading-rereg',
              status: 'hidden',
              hidden_reason: 'reregistration_required',
            },
          ] as TravelInsuranceFirmDocument[],
        ],
      ]);

      const result = await evaluateFirmState(
        createMockFirm({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
        { tradingFirmsByMainFirmId },
      );

      expect(result.relatedFirmUpdates).toEqual([]);
    });

    // AC 2: And no restore email is sent.
    it('does not send a restore email', async () => {
      const result = await evaluateFirmState(
        createMockFirm({
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      );

      expect(result.notifyTarget).toBeNull();
    });

    // AC 2: hidden for another reason (re-registration lapse) must stay hidden — do not force active.
    it('does not restore when re-registration has also lapsed — lapse hide wins', async () => {
      (validateReRegistration as jest.Mock).mockReturnValueOnce({
        ...createDefaultReRegChecks(),
        reregistrationHasLapsed: true,
        hasWindowStartEmailBeenSent: true,
        hasSentLapsedEmail: false,
      });

      const result = await evaluateFirmState(
        createMockFirm({
          status: 'active',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      );

      expect(result.firmUpdates.status).toBe('hidden');
      expect(result.firmUpdates.hidden_reason).toBe('reregistration_required');
      expect(result.firmUpdates.reregistered_at).toBeDefined();
    });
  });

  describe('AC 3: FCA source of truth — trading name no longer current', () => {
    // AC 3: Then hide as Trading_name-Inactive_or_Not_Current when the name is no longer current.
    it('hides an active trading name as Trading_name-Inactive_or_Not_Current', async () => {
      mockFcaValid(['Other Trading Name']);

      const result = await evaluateFirmState(
        createMockFirm({ type: 'trading', status: 'active' }),
      );

      expect(result.firmUpdates).toEqual({
        status: 'hidden',
        hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
      });
      expect(result.failure?.issue).toBe('Invalid Trading Firm');
    });

    // AC 3 / AC 4: And the record is kept in the database (status patch only — no delete).
    it('keeps the record (status patch only — no delete)', async () => {
      mockFcaValid(['Other Trading Name']);

      const result = await evaluateFirmState(
        createMockFirm({ type: 'trading', status: 'active' }),
      );

      expect(result.firmUpdates).toEqual({
        status: 'hidden',
        hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
      });
      expect(result.firmUpdates).not.toHaveProperty('id');
    });

    // AC 3: And if already hidden for another reason (Invalid_FCA), the sync must not overwrite that hide.
    it('does not overwrite a trading name already hidden for Invalid_FCA', async () => {
      mockFcaValid(['Other Trading Name']);

      const result = await evaluateFirmState(
        createMockFirm({
          type: 'trading',
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      );

      expect(result.firmUpdates).toEqual({});
    });

    // AC 3: And if already hidden for another reason (re-registration), the sync must not overwrite that hide.
    it('does not overwrite a trading name already hidden for re-registration', async () => {
      mockFcaValid(['Other Trading Name']);

      const result = await evaluateFirmState(
        createMockFirm({
          type: 'trading',
          status: 'hidden',
          hidden_reason: 'reregistration_required',
        }),
      );

      expect(result.firmUpdates).toEqual({});
    });
  });

  describe('AC 5: FCA source of truth — trading name current again', () => {
    // AC 5: Then automatically set this trading name’s status back to active (hidden by AC 3 only).
    it('sets a trading name hidden by AC 3 back to active', async () => {
      mockFcaValid(['ACME ADVISORY ']);

      const result = await evaluateFirmState(
        createMockFirm({
          type: 'trading',
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
        }),
      );

      expect(result.firmUpdates).toEqual({
        status: 'active',
        hidden_reason: null,
      });
    });

    // AC 5: And if hidden for another reason (Invalid FRN), it must stay hidden — FCA must not force active.
    it('does not force active when hidden for Invalid_FCA', async () => {
      mockFcaValid(['ACME ADVISORY ']);

      const result = await evaluateFirmState(
        createMockFirm({
          type: 'trading',
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        }),
      );

      expect(result.firmUpdates).toEqual({});
    });

    // AC 5: And if hidden for another reason (re-registration), it must stay hidden — FCA must not force active.
    it('does not force active when hidden for re-registration', async () => {
      mockFcaValid(['ACME ADVISORY ']);

      const result = await evaluateFirmState(
        createMockFirm({
          type: 'trading',
          status: 'hidden',
          hidden_reason: 'reregistration_required',
        }),
      );

      expect(result.firmUpdates).toEqual({});
    });
  });

  describe('re-registration checks', () => {
    it('sends window start email when inside renewal window and start email not sent', async () => {
      (validateReRegistration as jest.Mock).mockReturnValueOnce({
        ...createDefaultReRegChecks(),
        isWithinRenewalWindow: true,
        hasWindowStartEmailBeenSent: false,
      });

      const firm = createMockFirm();
      const result = await evaluateFirmState(firm);

      expect(
        result.firmUpdates.reRegistrationLogs?.reRegWindowStartEmailSentAt,
      ).toBeDefined();
      expect(result.notifyTarget?.emailTemplate).toBe('tidReregistration');
      expect(result.failure?.issue).toContain('within_window');
      expect(result.firmUpdates).not.toHaveProperty('status');
      expect(result.relatedFirmUpdates).toEqual([]);
    });

    it('hides main firm and trading firms and sends one lapsed email to main principal', async () => {
      (validateReRegistration as jest.Mock).mockReturnValueOnce({
        ...createDefaultReRegChecks(),
        reregistrationHasLapsed: true,
        hasWindowStartEmailBeenSent: true,
        hasSentLapsedEmail: false,
      });

      const firm = createMockFirm({
        pending_add_to_directory: true,
        pending_add_to_directory_until: '2099-01-15T00:00:00.000Z',
      });
      const tradingFirmsByMainFirmId = new Map([
        [
          'firm-123',
          [
            { id: 'trading-1', status: 'active', hidden_reason: null },
            {
              id: 'trading-fca',
              status: 'active',
              hidden_reason: HIDDEN_DUE_TO_FCA,
            },
          ] as TravelInsuranceFirmDocument[],
        ],
      ]);
      const result = await evaluateFirmState(firm, {
        tradingFirmsByMainFirmId,
      });

      expect(result.firmUpdates.status).toBe('hidden');
      expect(result.firmUpdates.hidden_reason).toBe('reregistration_required');
      expect(result.firmUpdates.reregistered_at).toBeDefined();
      expect(result.firmUpdates.pending_add_to_directory).toBe(false);
      expect(result.firmUpdates.pending_add_to_directory_until).toBeNull();
      expect(result.firmUpdates.reRegistrationLogs?.lapsedEmailSentAt).toBe(
        result.firmUpdates.reregistered_at,
      );
      expect(result.notifyTarget?.emailTemplate).toBe('tidReregistration');
      expect(result.failure?.issue).toContain('lapsed');
      expect(result.relatedFirmUpdates).toEqual([
        {
          id: 'trading-1',
          updates: {
            status: 'hidden',
            hidden_reason: 'reregistration_required',
          },
        },
      ]);
    });

    it('returns no related trading updates when trading firms are not preloaded', async () => {
      (validateReRegistration as jest.Mock).mockReturnValueOnce({
        ...createDefaultReRegChecks(),
        reregistrationHasLapsed: true,
        hasWindowStartEmailBeenSent: true,
        hasSentLapsedEmail: false,
      });

      const result = await evaluateFirmState(createMockFirm());

      expect(result.relatedFirmUpdates).toEqual([]);
    });

    it('hides main and trading when Keep deadline passes after in-window renew', async () => {
      const firm = createMockFirm({
        status: 'active',
        pending_add_to_directory: true,
        pending_add_to_directory_until: '2020-01-15T00:00:00.000Z',
        reregistered_at: '2019-12-01T00:00:00.000Z',
      });
      const tradingFirmsByMainFirmId = new Map([
        [
          'firm-123',
          [
            {
              id: 'trading-1',
              status: 'active',
              hidden_reason: null,
            },
          ] as TravelInsuranceFirmDocument[],
        ],
      ]);
      const result = await evaluateFirmState(firm, {
        tradingFirmsByMainFirmId,
      });

      expect(result.firmUpdates).toEqual({
        status: 'hidden',
        hidden_reason: 'reregistration_required',
        reregistered_at: '2019-12-01T00:00:00.000Z',
        pending_add_to_directory: false,
        pending_add_to_directory_until: null,
      });
      expect(result.failure?.issue).toContain('missed_keep_deadline');
      expect(result.relatedFirmUpdates).toEqual([
        {
          id: 'trading-1',
          updates: {
            status: 'hidden',
            hidden_reason: 'reregistration_required',
          },
        },
      ]);
      expect(result.notifyTarget).toBeNull();
    });

    it('does not hide for pending Keep while deadline is still in the future', async () => {
      const firm = createMockFirm({
        status: 'active',
        pending_add_to_directory: true,
        pending_add_to_directory_until: '2099-01-15T00:00:00.000Z',
      });
      const result = await evaluateFirmState(firm);

      expect(result.firmUpdates).toEqual({});
      expect(result.failure).toBeNull();
      expect(result.relatedFirmUpdates).toEqual([]);
    });

    it('returns empty updates if re-registration checks pass cleanly', async () => {
      const firm = createMockFirm();
      const result = await evaluateFirmState(firm);

      expect(result.firmUpdates).toEqual({});
      expect(result.failure).toBeNull();
      expect(result.notifyTarget).toBeNull();
    });
  });
});

describe('indexTradingFirmsByMainFirmId', () => {
  it('groups trading firms by main_firm_id and ignores other document types', () => {
    const mainFirm = createMockFirm({ id: 'main-1', type: 'main' });
    const tradingOne = createMockFirm({
      id: 'trading-1',
      type: 'trading',
      main_firm_id: 'main-1',
    });
    const tradingTwo = createMockFirm({
      id: 'trading-2',
      type: 'trading',
      main_firm_id: 'main-1',
    });
    const otherMainTrading = createMockFirm({
      id: 'trading-3',
      type: 'trading',
      main_firm_id: 'main-2',
    });
    const legacyTrading = createMockFirm({
      id: 'trading-legacy',
      type: 'trading',
      main_firm_id: undefined,
    });

    const indexed = indexTradingFirmsByMainFirmId([
      mainFirm,
      tradingOne,
      tradingTwo,
      otherMainTrading,
      legacyTrading,
    ]);

    expect(indexed.get('main-1')).toEqual([tradingOne, tradingTwo]);
    expect(indexed.get('main-2')).toEqual([otherMainTrading]);
    expect(indexed.has('main-3')).toBe(false);
  });
});
