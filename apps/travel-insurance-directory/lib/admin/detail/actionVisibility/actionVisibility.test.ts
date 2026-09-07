import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { createEligibleAdminFirm } from 'lib/admin/shared/testing/adminFirmFixtures';
import {
  emptyServiceDetails,
  emptySpecificConditions,
} from 'lib/firms/firmDefaults';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';

import {
  areFirmSectionsComplete,
  canShowAdminApproveButton,
  canShowAdminReregisterButton,
  canShowKeepOnDirectory,
  getAdminFirmActionVisibility,
  hasActivePendingReregistration,
  isRegistrationEligibleForAdminActions,
} from './actionVisibility';

describe('firmDirectoryActions', () => {
  describe('areFirmSectionsComplete', () => {
    it('is false when cover and contact are not both completed', () => {
      expect(areFirmSectionsComplete(createMockFirm())).toBe(false);
    });

    it('is true when cover and contact sections are completed', () => {
      expect(areFirmSectionsComplete(createEligibleAdminFirm())).toBe(true);
    });
  });

  describe('isRegistrationEligibleForAdminActions', () => {
    it('is true for main firm when approved_at is set', () => {
      expect(
        isRegistrationEligibleForAdminActions(createEligibleAdminFirm(), null),
      ).toBe(true);
    });

    it('is true for main firm when only reregister_approved_at is set', () => {
      expect(
        isRegistrationEligibleForAdminActions(
          createEligibleAdminFirm({
            approved_at: null,
            reregister_approved_at: '2024-12-24T11:19:00Z',
          }),
          null,
        ),
      ).toBe(true);
    });

    it('is false for main firm when neither approval timestamp is set', () => {
      expect(
        isRegistrationEligibleForAdminActions(
          createEligibleAdminFirm({
            approved_at: null,
            reregister_approved_at: null,
          }),
          null,
        ),
      ).toBe(false);
    });

    it('is true when approved_at is set even if medical answers are incomplete', () => {
      const firm = createEligibleAdminFirm({
        approved_at: '2024-10-16T09:21:00Z',
        medical_coverage: {
          ...createEligibleAdminFirm().medical_coverage,
          specific_conditions: emptySpecificConditions(),
        },
      });

      expect(isRegistrationEligibleForAdminActions(firm, null)).toBe(true);
    });

    it('uses parent main firm for trading documents', () => {
      const main = createEligibleAdminFirm({ id: 'main-1' });
      const trading = createMockTradingFirm({
        main_firm_id: main.id,
        trip_covers: main.trip_covers,
        service_details: main.service_details,
        office: main.office,
        website_address: main.website_address,
      });

      expect(
        isRegistrationEligibleForAdminActions(
          trading,
          createEligibleAdminFirm(),
        ),
      ).toBe(true);
      expect(isRegistrationEligibleForAdminActions(trading, null)).toBe(false);
    });
  });

  describe('getAdminFirmActionVisibility', () => {
    it.each(['hidden', 'pending_approval'] as const)(
      'shows Approve when eligible and status is %s',
      (status) => {
        const firm = createEligibleAdminFirm({ status });

        expect(getAdminFirmActionVisibility(firm, null)).toEqual({
          showApprove: true,
          showKeep: false,
          showHide: false,
          showReregister: true,
          approveLabel: 'Add to Directory',
        });
      },
    );

    it('shows Hide when eligible and status is active', () => {
      const firm = createEligibleAdminFirm({ status: 'active' });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: false,
        showKeep: false,
        showHide: true,
        showReregister: true,
        approveLabel: 'Add to Directory',
      });
    });

    it('shows Keep on directory when pending after in-window renew', () => {
      const firm = createEligibleAdminFirm({
        status: 'active',
        pending_add_to_directory: true,
        pending_add_to_directory_until: '2099-01-15T00:00:00.000Z',
        reregistered_at: '2024-12-01T00:00:00Z',
        reregister_approved_at: '2024-12-20T00:00:00Z',
        renewal_draft: null,
      });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: true,
        showKeep: true,
        showHide: false,
        showReregister: true,
        approveLabel: 'Keep on directory',
      });
      expect(canShowKeepOnDirectory(firm, null)).toBe(true);
    });

    it('does not show Keep when firm is already hidden', () => {
      const firm = createEligibleAdminFirm({
        status: 'hidden',
        pending_add_to_directory: true,
        pending_add_to_directory_until: '2099-01-15T00:00:00.000Z',
        reregistered_at: '2024-12-01T00:00:00Z',
        reregister_approved_at: '2024-12-20T00:00:00Z',
      });

      expect(canShowKeepOnDirectory(firm, null)).toBe(false);
      expect(getAdminFirmActionVisibility(firm, null).approveLabel).toBe(
        'Add to Directory',
      );
    });

    it('hides Add when sections are incomplete but still allows Hide when active', () => {
      const firm = createEligibleAdminFirm({
        status: 'active',
        service_details: emptyServiceDetails(),
        trip_covers: [],
        cover_service_confirmed_at: null,
        customer_contact_confirmed_at: null,
      });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: false,
        showKeep: false,
        showHide: true,
        showReregister: true,
        approveLabel: 'Add to Directory',
      });
    });

    it('hides Add when hidden and sections are incomplete', () => {
      const firm = createEligibleAdminFirm({
        status: 'hidden',
        service_details: emptyServiceDetails(),
        trip_covers: [],
      });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: false,
        showKeep: false,
        showHide: false,
        showReregister: true,
        approveLabel: 'Add to Directory',
      });
    });

    it('hides both actions when registration approval timestamps are missing', () => {
      const firm = createEligibleAdminFirm({
        status: 'active',
        approved_at: null,
        reregister_approved_at: null,
      });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: false,
        showKeep: false,
        showHide: false,
        showReregister: false,
        approveLabel: 'Add to Directory',
      });
    });

    it('hides Add to Directory when re-registration is pending', () => {
      const firm = createEligibleAdminFirm({
        status: 'hidden',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: false,
        showKeep: false,
        showHide: false,
        showReregister: false,
        approveLabel: 'Add to Directory',
      });
    });

    it('shows Add to Directory when re-registration is completed', () => {
      const firm = createEligibleAdminFirm({
        status: 'hidden',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });

      expect(getAdminFirmActionVisibility(firm, null)).toEqual({
        showApprove: true,
        showKeep: false,
        showHide: false,
        showReregister: true,
        approveLabel: 'Add to Directory',
      });
    });

    it('shows Add to Directory when never re-registered', () => {
      const firm = createEligibleAdminFirm({
        status: 'hidden',
        reregistered_at: null,
        reregister_approved_at: null,
      });

      expect(canShowAdminApproveButton(firm, null)).toBe(true);
    });

    it('inherits pending re-registration from main for trading documents', () => {
      const main = createEligibleAdminFirm({
        id: 'main-1',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });
      const trading = createMockTradingFirm({
        main_firm_id: main.id,
        status: 'hidden',
        trip_covers: main.trip_covers,
        service_details: main.service_details,
        office: main.office,
        website_address: main.website_address,
      });

      expect(canShowAdminApproveButton(trading, main)).toBe(false);
    });

    it.each([HIDDEN_DUE_TO_FCA, HIDDEN_DUE_TO_TRADING_NAME] as const)(
      'hides all actions when hidden_reason is %s',
      (hiddenReason) => {
        const firm = createEligibleAdminFirm({
          status: 'hidden',
          hidden_reason: hiddenReason,
        });

        expect(getAdminFirmActionVisibility(firm, null)).toEqual({
          showApprove: false,
          showKeep: false,
          showHide: false,
          showReregister: false,
          approveLabel: 'Add to Directory',
        });
        expect(canShowAdminApproveButton(firm, null)).toBe(false);
        expect(canShowAdminReregisterButton(firm)).toBe(false);
        expect(canShowKeepOnDirectory(firm, null)).toBe(false);
      },
    );
  });

  describe('hasActivePendingReregistration', () => {
    it('is true when reregistered_at is set and reregister_approved_at is null', () => {
      const firm = createMockFirm({
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(hasActivePendingReregistration(firm)).toBe(true);
    });

    it('is false when re-registration is completed', () => {
      const firm = createMockFirm({
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });

      expect(hasActivePendingReregistration(firm)).toBe(false);
    });
  });

  describe('canShowAdminReregisterButton', () => {
    it('shows for approved main firm with no re-registration', () => {
      const firm = createMockFirm({
        approved_at: '2024-10-16T09:21:00Z',
        reregistered_at: null,
        reregister_approved_at: null,
      });

      expect(canShowAdminReregisterButton(firm)).toBe(true);
    });

    it('shows again after completed re-registration', () => {
      const firm = createMockFirm({
        approved_at: '2024-10-16T09:21:00Z',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });

      expect(canShowAdminReregisterButton(firm)).toBe(true);
    });

    it('hides while re-registration is in progress', () => {
      const firm = createMockFirm({
        approved_at: '2024-10-16T09:21:00Z',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(canShowAdminReregisterButton(firm)).toBe(false);
    });

    it('hides when initial registration is not approved', () => {
      const firm = createMockFirm({
        approved_at: null,
        reregistered_at: null,
        reregister_approved_at: null,
      });

      expect(canShowAdminReregisterButton(firm)).toBe(false);
    });

    it('hides for trading firms', () => {
      const trading = createMockTradingFirm({
        approved_at: '2024-10-16T09:21:00Z',
      });

      expect(canShowAdminReregisterButton(trading)).toBe(false);
    });
  });
});
