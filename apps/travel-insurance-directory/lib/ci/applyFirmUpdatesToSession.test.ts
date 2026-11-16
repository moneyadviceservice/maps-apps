import { IronSessionObject } from 'types/iron-session';

import { applyFirmUpdatesToSession } from './applyFirmUpdatesToSession';

describe('applyFirmUpdatesToSession', () => {
  let mockSession: IronSessionObject;

  beforeEach(() => {
    mockSession = {
      db_id: undefined,
      firmData: undefined,
      save: jest.fn().mockResolvedValue(undefined),
    };
  });

  it('sets default db_id and calls save when no updates are provided', async () => {
    const result = await applyFirmUpdatesToSession(mockSession, {});

    expect(mockSession.db_id).toBe('playwright-id');
    expect(mockSession.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      response: { id: 'playwright-id' },
    });
  });

  it('preserves existing db_id if already present', async () => {
    mockSession.db_id = 'existing-id';
    await applyFirmUpdatesToSession(mockSession, {});

    expect(mockSession.db_id).toBe('existing-id');
  });

  it('initializes firmData if it does not exist', async () => {
    const updates = { name: 'Insurance Co' };
    await applyFirmUpdatesToSession(mockSession, updates);

    expect(mockSession.firmData).toEqual({
      type: 'main',
      medical_coverage: { specific_conditions: {} },
      name: 'Insurance Co',
    });
    expect(mockSession.save).toHaveBeenCalled();
  });

  it('performs a top-level update', async () => {
    mockSession.firmData = { name: 'Old Name', status: 'active' };
    await applyFirmUpdatesToSession(mockSession, { name: 'New Name' });

    expect(mockSession.firmData?.name).toBe('New Name');
    expect(mockSession.firmData?.status).toBe('active');
  });

  it('performs a deep update for 3-segment paths', async () => {
    await applyFirmUpdatesToSession(mockSession, {
      'settings/notifications/email': true,
    });
    expect(mockSession.firmData?.settings?.notifications?.email).toBe(true);

    await applyFirmUpdatesToSession(mockSession, {
      'settings/notifications/phone': false,
    });
    expect(mockSession.firmData?.settings?.notifications?.phone).toBe(false);
  });

  it('performs a deep update for 4-segment paths (opening hours)', async () => {
    await applyFirmUpdatesToSession(mockSession, {
      'office/opening_times/weekday/opening_time': '09:00',
      'office/opening_times/weekday/closing_time': '17:30',
    });

    expect(mockSession.firmData?.office?.opening_times?.weekday).toEqual({
      opening_time: '09:00',
      closing_time: '17:30',
    });
  });

  it('handles 2-segment paths', async () => {
    mockSession.firmData = { a: { b: {} } };
    await applyFirmUpdatesToSession(mockSession, { 'a/b': 'works' });

    expect(mockSession.firmData?.a?.b).toBe('works');
  });
});
