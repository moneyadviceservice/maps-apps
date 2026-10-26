jest.mock('lib/firms/fetchFirm', () => ({
  getFirmById: jest.fn(),
  getSessionFirm: jest.fn(),
}));

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { getFirmById, getSessionFirm } from 'lib/firms/fetchFirm';

import { resolveRegisterFirm } from './resolveRegisterFirm';

const mockedGetFirmById = getFirmById as jest.Mock;
const mockedGetSessionFirm = getSessionFirm as jest.Mock;

describe('resolveRegisterFirm', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.CI;
  });

  afterAll(() => {
    process.env.CI = originalCi;
  });

  it('loads firm by db_id outside CI', async () => {
    const byIdFirm = createMockFirm({ id: 'firm-cosmos' });
    mockedGetFirmById.mockResolvedValue({
      success: true,
      response: byIdFirm,
    });

    const result = await resolveRegisterFirm({ db_id: 'firm-cosmos' });

    expect(result).toEqual(byIdFirm);
    expect(mockedGetFirmById).toHaveBeenCalledWith('firm-cosmos');
    expect(mockedGetSessionFirm).not.toHaveBeenCalled();
  });

  it('uses session firm under CI when firmData is present', async () => {
    process.env.CI = 'true';
    const sessionFirm = createMockFirm({ id: 'playwright-id' });
    mockedGetSessionFirm.mockReturnValue({
      success: true,
      response: sessionFirm,
    });

    const result = await resolveRegisterFirm({
      db_id: 'playwright-id',
      firmData: sessionFirm as never,
    });

    expect(result).toEqual(sessionFirm);
    expect(mockedGetSessionFirm).toHaveBeenCalledWith(
      { db_id: 'playwright-id', firmData: sessionFirm },
      'playwright-id',
    );
    expect(mockedGetFirmById).not.toHaveBeenCalled();
  });

  it('falls back to session firm when by-id lookup fails', async () => {
    const sessionFirm = createMockFirm({ id: 'firm-session' });
    mockedGetFirmById.mockResolvedValue({ success: false });
    mockedGetSessionFirm.mockReturnValue({
      success: true,
      response: sessionFirm,
    });

    const result = await resolveRegisterFirm({
      db_id: 'missing',
      firmData: sessionFirm as never,
    });

    expect(result).toEqual(sessionFirm);
    expect(mockedGetFirmById).toHaveBeenCalledWith('missing');
  });

  it('returns null when no firm can be resolved', async () => {
    mockedGetFirmById.mockResolvedValue({ success: false });
    mockedGetSessionFirm.mockReturnValue({ success: true, response: {} });

    const result = await resolveRegisterFirm({ db_id: 'missing' });

    expect(result).toBeNull();
  });
});
