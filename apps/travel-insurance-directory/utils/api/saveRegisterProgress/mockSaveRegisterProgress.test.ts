import { IronSessionObject } from 'types/iron-session';

import { mockSaveRegisterProgress } from './mockSaveRegisterProgress';

describe('mockSaveRegisterProgress', () => {
  let mockSession: IronSessionObject;

  beforeEach(() => {
    // Reset the mock session before each test
    mockSession = {
      db_id: undefined,
      firmData: undefined,
      save: jest.fn().mockResolvedValue(undefined),
    };
  });

  it('should set default db_id and call save when no updates are provided', async () => {
    const result = await mockSaveRegisterProgress({ session: mockSession });

    expect(mockSession.db_id).toBe('playwright-id');
    expect(mockSession.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      response: { id: 'playwright-id' },
    });
  });

  it('should preserve existing db_id if already present', async () => {
    mockSession.db_id = 'existing-id';
    await mockSaveRegisterProgress({ session: mockSession });

    expect(mockSession.db_id).toBe('existing-id');
  });

  it('should initialize firmData if it does not exist', async () => {
    const updates = { name: 'Insurance Co' };
    await mockSaveRegisterProgress({ session: mockSession, updates });

    expect(mockSession.firmData).toEqual({
      type: 'main',
      medical_coverage: { specific_conditions: {} },
      name: 'Insurance Co',
    });
    expect(mockSession.save).toHaveBeenCalled();
  });

  it('should perform a top-level update when keys length is 1', async () => {
    mockSession.firmData = { name: 'Old Name', status: 'active' };
    const updates = { name: 'New Name' };

    await mockSaveRegisterProgress({ session: mockSession, updates });

    expect(mockSession.firmData.name).toBe('New Name');
    expect(mockSession.firmData.status).toBe('active');
  });

  it('should perform a deep update when keys length is 3 (path/to/key)', async () => {
    const updates = {
      'settings/notifications/email': true,
    };
    const secondUpdate = {
      'settings/notifications/phone': false,
    };

    await mockSaveRegisterProgress({ session: mockSession, updates });
    expect(mockSession.firmData.settings.notifications.email).toBe(true);

    await mockSaveRegisterProgress({
      session: mockSession,
      updates: secondUpdate,
    });
    expect(mockSession.firmData.settings.notifications.phone).toBe(false);
  });

  it('should handle multiple mixed updates (shallow and deep)', async () => {
    mockSession.firmData = {
      name: 'Original',
      meta: {
        config: {
          version: 1,
        },
      },
    };

    const updates = {
      name: 'Updated',
      'meta/config/version': 2,
    };

    await mockSaveRegisterProgress({ session: mockSession, updates });

    expect(mockSession.firmData.name).toBe('Updated');
    expect(mockSession.firmData.meta.config.version).toBe(2);
  });

  it('should handle 2-segment paths via shared merge utility', async () => {
    mockSession.firmData = { a: { b: {} } };
    const updates = { 'a/b': 'works' };

    await mockSaveRegisterProgress({ session: mockSession, updates });

    expect(mockSession.firmData.a.b).toBe('works');
  });
});
