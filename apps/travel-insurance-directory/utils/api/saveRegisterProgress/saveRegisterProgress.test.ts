jest.mock(
  'lib/firms/fetchFirm',
  () => ({
    getFirmById: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  'lib/firms/createFirm',
  () => ({
    createFirm: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  'lib/firms/updateFirm',
  () => ({
    updateFirm: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  './mockSaveRegisterProgress',
  () => ({
    mockSaveRegisterProgress: jest.fn(),
  }),
  { virtual: true },
);

import { createFirm } from 'lib/firms/createFirm';
import { getFirmById } from 'lib/firms/fetchFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';

import { mockSaveRegisterProgress } from './mockSaveRegisterProgress';
import { saveRegisterProgress } from './saveRegisterProgress';

const mockedCreateFirm = createFirm as jest.Mock;
const mockedGetFirmById = getFirmById as jest.Mock;
const mockedUpdateFirm = updateFirm as jest.Mock;
const mockedMockSaveRegisterProgress = mockSaveRegisterProgress as jest.Mock;

describe('saveRegisterProgress', () => {
  let mockSession: IronSessionObject;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetFirmById.mockResolvedValue({
      success: true,
      response: { fca_number: 111111 },
    });

    mockSession = {
      db_id: undefined,
      fcaData: undefined,
      save: jest.fn().mockResolvedValue(undefined),
    };
  });

  it('should call updateFirm when db_id and updates are present', async () => {
    mockSession.db_id = 'firm_123';
    const updates = { registered_name: 'New Name' };

    mockedUpdateFirm.mockResolvedValue({ success: true });

    const result = await saveRegisterProgress({
      session: mockSession,
      updates,
    });

    expect(mockedUpdateFirm).toHaveBeenCalledWith('firm_123', updates);
    expect(mockedCreateFirm).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should return error when updates are present but db_id is missing', async () => {
    mockSession.fcaData = { frnNumber: '111111', firmName: 'Test Ltd' };
    const updates = { covered_by_ombudsman_question: 'true' };

    const result = await saveRegisterProgress({
      session: mockSession,
      updates,
    });

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('No firm ID found in session'),
    });
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
    expect(mockedCreateFirm).not.toHaveBeenCalled();
  });

  it('should return success without create or update when db_id exists and no updates', async () => {
    mockSession.db_id = 'firm_123';
    mockSession.fcaData = { frnNumber: '111111', firmName: 'Test Ltd' };

    const result = await saveRegisterProgress({ session: mockSession });

    expect(result).toEqual({ success: true });
    expect(mockedCreateFirm).not.toHaveBeenCalled();
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('clears stale db_id and creates a new firm when FRN mismatches', async () => {
    mockSession.db_id = 'firm_old';
    mockSession.fcaData = { frnNumber: '222222', firmName: 'New Ltd' };

    mockedGetFirmById.mockResolvedValue({
      success: true,
      response: { fca_number: 111111 },
    });
    mockedCreateFirm.mockResolvedValue({
      response: { id: 'new_firm_999' },
    });

    const result = await saveRegisterProgress({ session: mockSession });

    expect(mockSession.db_id).toBe('new_firm_999');
    expect(mockedCreateFirm).toHaveBeenCalled();
    expect(result.response.id).toBe('new_firm_999');
  });

  it('uses emailFallback for principal when userData.mail is missing', async () => {
    mockSession.fcaData = { frnNumber: '111111', firmName: 'Test Ltd' };
    mockedCreateFirm.mockResolvedValue({
      response: { id: 'new_firm_999' },
    });

    await saveRegisterProgress({
      session: mockSession,
      emailFallback: 'otp@example.com',
    });

    expect(mockedCreateFirm).toHaveBeenCalledWith({
      frnNumber: '111111',
      firmName: 'Test Ltd',
      principal: {
        first_name: '',
        last_name: '',
        job_title: null,
        email_address: 'otp@example.com',
        telephone_number: null,
        individual_reference_number: '',
      },
    });
  });

  it('should call createFirm and save id to session when db_id is missing and no updates', async () => {
    mockSession.fcaData = { frnNumber: '111111', firmName: 'Test Ltd' };

    mockedCreateFirm.mockResolvedValue({
      response: { id: 'new_firm_999' },
    });

    const result = await saveRegisterProgress({ session: mockSession });

    expect(mockedCreateFirm).toHaveBeenCalledWith({
      frnNumber: '111111',
      firmName: 'Test Ltd',
      principal: undefined,
    });
    expect(mockSession.db_id).toBe('new_firm_999');
    expect(mockSession.save).toHaveBeenCalled();
    expect(result.response.id).toBe('new_firm_999');
  });

  it('should return an error if neither db_id nor fcaData is available', async () => {
    const result = await saveRegisterProgress({ session: mockSession });

    expect(result).toEqual({ error: 'Error saving registration progress.' });
    expect(mockedCreateFirm).not.toHaveBeenCalled();
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('should not save session if createFirm fails to return a response', async () => {
    mockSession.fcaData = { frnNumber: '111111', firmName: 'Test Ltd' };
    mockedCreateFirm.mockResolvedValue({ error: 'Failed' });

    await saveRegisterProgress({ session: mockSession });

    expect(mockSession.save).not.toHaveBeenCalled();
    expect(mockSession.db_id).toBeUndefined();
  });

  it('should call mockSaveRegisterProgress when process.env.CI is true', async () => {
    const originalCI = process.env.CI;

    try {
      process.env.CI = 'true';

      const updates = { registered_name: 'Mock Firm' };

      mockedMockSaveRegisterProgress.mockResolvedValue({
        success: true,
      });

      const result = await saveRegisterProgress({
        session: mockSession,
        updates,
      });

      expect(mockedMockSaveRegisterProgress).toHaveBeenCalledWith({
        session: mockSession,
        updates,
      });

      expect(mockedCreateFirm).not.toHaveBeenCalled();
      expect(mockedUpdateFirm).not.toHaveBeenCalled();

      expect(result).toEqual({ success: true });
    } finally {
      process.env.CI = originalCI;
    }
  });

  it('persists renewal updates to Cosmos under CI for resume CTA', async () => {
    const originalCI = process.env.CI;

    try {
      process.env.CI = 'true';
      mockSession.db_id = 'firm_123';
      const updates = { renewal_resume_href: '/register/firm/step2' };

      mockedUpdateFirm.mockResolvedValue({ success: true });

      const result = await saveRegisterProgress({
        session: mockSession,
        updates,
      });

      expect(mockedMockSaveRegisterProgress).not.toHaveBeenCalled();
      expect(mockedUpdateFirm).toHaveBeenCalledWith('firm_123', updates);
      expect(result).toEqual({ success: true });
    } finally {
      process.env.CI = originalCI;
    }
  });
});
