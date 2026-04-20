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

import { createFirm } from 'lib/firms/createFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';

import { saveRegisterProgress } from './saveRegisterProgress';

const mockedCreateFirm = createFirm as jest.Mock;
const mockedUpdateFirm = updateFirm as jest.Mock;

describe('saveRegisterProgress', () => {
  let mockSession: IronSessionObject;

  beforeEach(() => {
    jest.clearAllMocks();

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

  it('should call createFirm and save id to session when db_id is missing', async () => {
    mockSession.fcaData = { fca_number: 111111 };

    mockedCreateFirm.mockResolvedValue({
      response: { id: 'new_firm_999' },
    });

    const result = await saveRegisterProgress({ session: mockSession });

    expect(mockedCreateFirm).toHaveBeenCalledWith(mockSession.fcaData);
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
    mockSession.fcaData = { fca_number: 111111 };
    mockedCreateFirm.mockResolvedValue({ error: 'Failed' });

    await saveRegisterProgress({ session: mockSession });

    expect(mockSession.save).not.toHaveBeenCalled();
    expect(mockSession.db_id).toBeUndefined();
  });
});
