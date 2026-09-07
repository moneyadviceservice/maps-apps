import { getAdminFirmActionVisibility } from 'lib/admin/detail/actionVisibility/actionVisibility';
import { getAdminCiFixtureFirmById } from 'lib/admin/dashboard/ciFixture/ciFixture';

import {
  adminE2eFirmConstants,
  buildAdminE2eFirmSeed,
  parseAdminE2eFirmQuery,
} from './adminE2eFirmConstants';

describe('adminE2eFirmConstants', () => {
  it('builds Firm A as hidden + Add to Directory eligible', () => {
    const firm = buildAdminE2eFirmSeed('A');
    expect(firm.id).toBe(adminE2eFirmConstants.firmA.id);
    expect(firm.status).toBe('hidden');
    expect(firm.approved_at).toBeTruthy();
    expect(firm.cover_service_confirmed_at).toBeTruthy();
    expect(firm.customer_contact_confirmed_at).toBeTruthy();

    const visibility = getAdminFirmActionVisibility(firm, null);
    expect(visibility.showApprove).toBe(true);
    expect(visibility.showHide).toBe(false);
    expect(visibility.showReregister).toBe(true);
    expect(visibility.approveLabel).toBe('Add to Directory');
  });

  it('builds Firm B as active + Hide from Directory eligible', () => {
    const firm = buildAdminE2eFirmSeed('B');
    expect(firm.id).toBe(adminE2eFirmConstants.firmB.id);
    expect(firm.status).toBe('active');

    const visibility = getAdminFirmActionVisibility(firm, null);
    expect(visibility.showHide).toBe(true);
    expect(visibility.showApprove).toBe(false);
    expect(visibility.showReregister).toBe(true);
  });

  it('builds Firm C with incomplete registration (no admin actions)', () => {
    const firm = buildAdminE2eFirmSeed('C');
    expect(firm.id).toBe(adminE2eFirmConstants.firmC.id);
    expect(firm.approved_at).toBeNull();
    expect(firm.reregister_approved_at).toBeNull();
    expect(firm.cover_service_confirmed_at).toBeNull();
    expect(firm.customer_contact_confirmed_at).toBeNull();

    const visibility = getAdminFirmActionVisibility(firm, null);
    expect(visibility.showApprove).toBe(false);
    expect(visibility.showHide).toBe(false);
    expect(visibility.showKeep).toBe(false);
    expect(visibility.showReregister).toBe(false);
  });

  it('does not place Cosmos admin e2e ids in the CI dashboard fixture', () => {
    expect(
      getAdminCiFixtureFirmById(adminE2eFirmConstants.firmA.id),
    ).toBeNull();
    expect(
      getAdminCiFixtureFirmById(adminE2eFirmConstants.firmB.id),
    ).toBeNull();
    expect(
      getAdminCiFixtureFirmById(adminE2eFirmConstants.firmC.id),
    ).toBeNull();
  });

  it('parses firm query values', () => {
    expect(parseAdminE2eFirmQuery('A')).toBe('A');
    expect(parseAdminE2eFirmQuery('b')).toBe('B');
    expect(parseAdminE2eFirmQuery('c')).toBe('C');
    expect(parseAdminE2eFirmQuery('all')).toBe('all');
    expect(parseAdminE2eFirmQuery('ALL')).toBe('all');
    expect(parseAdminE2eFirmQuery(undefined)).toBeNull();
    expect(parseAdminE2eFirmQuery('D')).toBeNull();
    expect(parseAdminE2eFirmQuery(['a'])).toBe('A');
  });
});
