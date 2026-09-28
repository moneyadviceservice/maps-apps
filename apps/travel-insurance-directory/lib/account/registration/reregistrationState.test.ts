import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { addMonths } from 'date-fns';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';

import {
  getRegistrationAnniversary,
  getRenewalWindowStart,
  getReregistrationEffectiveDateIso,
  hasActivePendingReregistration,
  hasLapsedRegistrationEmailBeenSent,
  hasRegWindowStartEmailBeenSent,
  hasReregistrationLapsed,
  isInRenewalWindow,
} from './reregistrationState';

describe('reregistrationState', () => {
  describe('hasActivePendingReregistration', () => {
    it('is true when reregistered_at is set and reregister_approved_at is null', () => {
      const firm = createMockFirm({
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(hasActivePendingReregistration(firm)).toBe(true);
    });

    it('is true when reregistered_at is set after a prior completed renew', () => {
      const firm = createMockFirm({
        reregistered_at: '2025-12-01T00:00:00Z',
        reregister_approved_at: '2024-12-20T00:00:00Z',
        renewal_draft: null,
      });

      expect(hasActivePendingReregistration(firm)).toBe(true);
    });

    it('is true when renewal_draft is present even if reregistered_at is null', () => {
      const firm = createMockFirm({
        reregistered_at: null,
        reregister_approved_at: '2024-01-15T00:00:00Z',
        renewal_draft: buildRenewalDraftFromFirm(createMockFirm()),
      });

      expect(hasActivePendingReregistration(firm)).toBe(true);
    });

    it('is false when re-registration is completed', () => {
      const firm = createMockFirm({
        // Keep last trigger; approval is newer so not pending.
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
        renewal_draft: null,
      });

      expect(hasActivePendingReregistration(firm)).toBe(false);
    });

    it('is false when never re-registered', () => {
      const firm = createMockFirm({
        reregistered_at: null,
        reregister_approved_at: null,
        renewal_draft: null,
      });

      expect(hasActivePendingReregistration(firm)).toBe(false);
    });
  });

  describe('renewal window dates', () => {
    const approvedAt = '2025-01-15T12:00:00.000Z';
    const firm = createMockFirm({
      approved_at: approvedAt,
      reregister_approved_at: null,
    });

    it('derives anniversary as base + 12 months', () => {
      expect(getRegistrationAnniversary(firm)?.toISOString()).toBe(
        addMonths(new Date(approvedAt), 12).toISOString(),
      );
    });

    it('derives window start as base + 11 months', () => {
      expect(getRenewalWindowStart(firm)?.toISOString()).toBe(
        addMonths(new Date(approvedAt), 11).toISOString(),
      );
    });

    it('isInRenewalWindow is true inside the window', () => {
      const now = addMonths(new Date(approvedAt), 11);
      now.setDate(now.getDate() + 1);
      expect(isInRenewalWindow(firm, now)).toBe(true);
    });

    it('isInRenewalWindow is false before the window', () => {
      expect(isInRenewalWindow(firm, new Date(approvedAt))).toBe(false);
    });

    it('isInRenewalWindow is false on/after anniversary', () => {
      const anniversary = addMonths(new Date(approvedAt), 12);
      expect(isInRenewalWindow(firm, anniversary)).toBe(false);
    });

    it('uses reregister_approved_at as period base after a completed renew', () => {
      const reregisterApprovedAt = '2024-12-20T09:00:00.000Z';
      const renewed = createMockFirm({
        approved_at: '2024-01-15T12:00:00.000Z',
        reregistered_at: '2024-12-01T00:00:00.000Z',
        reregister_approved_at: reregisterApprovedAt,
        renewal_draft: null,
      });

      expect(getRegistrationAnniversary(renewed)?.toISOString()).toBe(
        addMonths(new Date(reregisterApprovedAt), 12).toISOString(),
      );
    });

    it('ignores pending reregistered_at when choosing the period base', () => {
      const reregisterApprovedAt = '2024-12-20T09:00:00.000Z';
      const pending = createMockFirm({
        approved_at: '2024-01-15T12:00:00.000Z',
        reregistered_at: '2025-12-01T00:00:00.000Z',
        reregister_approved_at: reregisterApprovedAt,
        renewal_draft: null,
      });

      expect(getRegistrationAnniversary(pending)?.toISOString()).toBe(
        addMonths(new Date(reregisterApprovedAt), 12).toISOString(),
      );
    });

    it('getReregistrationEffectiveDateIso returns the anniversary ISO string', () => {
      expect(getReregistrationEffectiveDateIso(firm)).toBe(
        addMonths(new Date(approvedAt), 12).toISOString(),
      );
    });
  });

  describe('hasReregistrationLapsed', () => {
    const approvedAt = '2025-01-15T12:00:00.000Z';
    const mockedFirm = createMockFirm({ approved_at: approvedAt });
    const anniversary = getRegistrationAnniversary(mockedFirm) as Date;

    it('returns false if no registration anniversary exists', () => {
      const firm = createMockFirm({
        approved_at: null,
        reregistered_at: null,
      });

      expect(hasReregistrationLapsed(firm)).toBe(false);
    });

    it('returns false if current date is before the anniversary', () => {
      // 1 second before anniversary
      const now = new Date(anniversary.getTime() - 1000);

      expect(hasReregistrationLapsed(mockedFirm, now)).toBe(false);
    });

    it('returns true if current date is exactly on the anniversary', () => {
      expect(hasReregistrationLapsed(mockedFirm, anniversary)).toBe(true);
    });

    it('returns true if current date is after the anniversary', () => {
      // 1 second after anniversary
      const now = new Date(anniversary.getTime() + 1000);

      expect(hasReregistrationLapsed(mockedFirm, now)).toBe(true);
    });
  });

  describe('hasRegWindowStartEmailBeenSent', () => {
    it('returns true when reRegWindowStartEmailSentAt date string exists', () => {
      const firm = createMockFirm({
        reRegistrationLogs: {
          reRegWindowStartEmailSentAt: '2026-01-15T10:00:00.000Z',
        },
      });

      expect(hasRegWindowStartEmailBeenSent(firm)).toBe(true);
    });

    it('returns false when reRegWindowStartEmailSentAt is undefined', () => {
      const firm = createMockFirm({
        reRegistrationLogs: {},
      });

      expect(hasRegWindowStartEmailBeenSent(firm)).toBe(false);
    });

    it('returns false when reRegistrationLogs is undefined', () => {
      const firm = createMockFirm(undefined);

      expect(hasRegWindowStartEmailBeenSent(firm)).toBe(false);
    });
  });

  describe('hasLapsedRegistrationEmailBeenSent', () => {
    it('returns true when lapsedEmailSentAt date string exists', () => {
      const firm = createMockFirm({
        reRegistrationLogs: { lapsedEmailSentAt: '2026-02-01T12:00:00.000Z' },
      });

      expect(hasLapsedRegistrationEmailBeenSent(firm)).toBe(true);
    });

    it('returns false when lapsedEmailSentAt is undefined or empty', () => {
      const firm = createMockFirm({
        reRegistrationLogs: {},
      });

      expect(hasLapsedRegistrationEmailBeenSent(firm)).toBe(false);
    });

    it('returns false when reRegistrationLogs is undefined', () => {
      const firm = createMockFirm(undefined);

      expect(hasLapsedRegistrationEmailBeenSent(firm)).toBe(false);
    });
  });
});
