import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { createEligibleAdminFirm } from 'lib/admin/shared/testing/adminFirmFixtures';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';

import {
  applyDirectoryStatusAction,
  approveFirmForDirectory,
  hideFirmFromDirectory,
} from './directoryStatus';

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

const mockedInvalidateFirmsListingCache = jest.fn();
jest.mock('lib/firms/invalidateFirmsListingCache', () => ({
  invalidateFirmsListingCache: () => mockedInvalidateFirmsListingCache(),
}));

describe('updateFirmDirectoryStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpdateFirm.mockResolvedValue({ success: true });
    mockedInvalidateFirmsListingCache.mockResolvedValue(undefined);
  });

  describe('approveFirmForDirectory', () => {
    it('patches active status and clears hidden_at', async () => {
      const firm = createEligibleAdminFirm({ id: 'firm-1', status: 'hidden' });

      const result = await approveFirmForDirectory(firm, null);

      expect(result).toEqual({ success: true });
      expect(mockedUpdateFirm).toHaveBeenCalledWith(
        'firm-1',
        expect.objectContaining({
          status: 'active',
          hidden_at: null,
        }),
      );
      expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
    });

    it('returns not_eligible when sections are incomplete', async () => {
      const result = await approveFirmForDirectory(
        createMockFirm({ status: 'hidden' }),
        null,
      );

      expect(result).toEqual({ success: false, error: 'not_eligible' });
      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });

    it('returns invalid_transition when status is already active without pending keep', async () => {
      const firm = createEligibleAdminFirm({ status: 'active' });

      const result = await applyDirectoryStatusAction('approve', firm, null);

      expect(result).toEqual({ success: false, error: 'invalid_transition' });
      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });

    it('clears pending keep without changing status when Keep on directory', async () => {
      const firm = createEligibleAdminFirm({
        id: 'firm-keep',
        status: 'active',
        pending_add_to_directory: true,
        pending_add_to_directory_until: '2099-01-15T00:00:00.000Z',
        reregistered_at: '2024-12-01T00:00:00Z',
        reregister_approved_at: '2024-12-20T00:00:00Z',
        renewal_draft: null,
      });

      const result = await approveFirmForDirectory(firm, null);

      expect(result).toEqual({ success: true });
      expect(mockedUpdateFirm).toHaveBeenCalledWith('firm-keep', {
        pending_add_to_directory: false,
        pending_add_to_directory_until: null,
      });
      expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
    });

    it('clears pending fields when Add to Directory after late renew', async () => {
      const firm = createEligibleAdminFirm({
        id: 'firm-add',
        status: 'hidden',
        hidden_reason: 'reregistration_required',
        pending_add_to_directory: true,
        pending_add_to_directory_until: null,
        reregistered_at: '2025-01-15T00:00:00Z',
        reregister_approved_at: '2025-02-01T00:00:00Z',
      });

      const result = await approveFirmForDirectory(firm, null);

      expect(result).toEqual({ success: true });
      expect(mockedUpdateFirm).toHaveBeenCalledWith(
        'firm-add',
        expect.objectContaining({
          status: 'active',
          hidden_at: null,
          hidden_reason: null,
          pending_add_to_directory: false,
          pending_add_to_directory_until: null,
        }),
      );
    });

    it('does not invalidate cache when updateFirm fails', async () => {
      mockedUpdateFirm.mockResolvedValueOnce({ success: false });
      const firm = createEligibleAdminFirm({ status: 'hidden' });

      const result = await approveFirmForDirectory(firm, null);

      expect(result).toEqual({ success: false, error: 'update_failed' });
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });
  });

  describe('hideFirmFromDirectory', () => {
    it('patches hidden status and sets hidden_at', async () => {
      const firm = createEligibleAdminFirm({ id: 'firm-2', status: 'active' });

      const result = await hideFirmFromDirectory(firm, null);

      expect(result).toEqual({ success: true });
      expect(mockedUpdateFirm).toHaveBeenCalledWith(
        'firm-2',
        expect.objectContaining({
          status: 'hidden',
          hidden_at: expect.any(String),
        }),
      );
      expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
    });

    it('allows Hide when active even if sections are incomplete', async () => {
      const firm = createEligibleAdminFirm({
        id: 'firm-incomplete-hide',
        status: 'active',
        service_details: {
          ...createEligibleAdminFirm().service_details,
          offers_telephone_quote: null,
        },
        cover_service_confirmed_at: null,
        customer_contact_confirmed_at: null,
        trip_covers: [],
      });

      const result = await hideFirmFromDirectory(firm, null);

      expect(result).toEqual({ success: true });
      expect(mockedUpdateFirm).toHaveBeenCalledWith(
        'firm-incomplete-hide',
        expect.objectContaining({
          status: 'hidden',
          hidden_at: expect.any(String),
        }),
      );
    });

    it('returns invalid_transition when status is already hidden', async () => {
      const firm = createEligibleAdminFirm({ status: 'hidden' });

      const result = await applyDirectoryStatusAction('hide', firm, null);

      expect(result).toEqual({ success: false, error: 'invalid_transition' });
      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });

    it.each([HIDDEN_DUE_TO_FCA, HIDDEN_DUE_TO_TRADING_NAME] as const)(
      'returns not_eligible when hidden_reason is %s',
      async (hiddenReason) => {
        const firm = createEligibleAdminFirm({
          status: 'hidden',
          hidden_reason: hiddenReason,
        });

        const result = await applyDirectoryStatusAction('approve', firm, null);

        expect(result).toEqual({ success: false, error: 'not_eligible' });
        expect(mockedUpdateFirm).not.toHaveBeenCalled();
      },
    );
  });
});
