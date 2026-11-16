import {
  AppointmentPayload,
  getAppointment,
  GetAppointmentResponse,
} from './getAppointment';

const mockCode = 'test-code';
const mockUrl = 'https://mock-api/getAppointment';
let fetchSpy: jest.SpyInstance;

beforeAll(() => {
  process.env.APPOINTMENT_CODE = mockCode;
  process.env.APPOINTMENT_URL = mockUrl;
});

globalThis.fetch = jest.fn();

export const mockAppointmentResponse: GetAppointmentResponse = {
  appointment: {
    appointmentId: 'test-appointment-id',
    startDateTime: '2026-07-14T08:10:00Z',
    appointmentType: 'pw',
    appointmentLanguage: 'en',
    medium: 'phone',
    isDoubleSlot: false,
    isBslRequired: false,
    isInterpreterRequired: false,
  },
};

export const mockAppointmentPayload: AppointmentPayload = {
  appointmentId: 'test-appointment-id',
  dob: '2000-09-15',
};

describe('getAppointment', () => {
  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('returns the appointment details when the API responds successfully', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAppointmentResponse,
    });

    await expect(
      getAppointment(mockUrl, mockCode, mockAppointmentPayload),
    ).resolves.toEqual(mockAppointmentResponse);
  });

  it('sends the code and payload to the get appointment API', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAppointmentResponse,
    });

    await getAppointment(mockUrl, mockCode, mockAppointmentPayload);

    expect(fetchSpy).toHaveBeenCalledWith(`${mockUrl}?code=${mockCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockAppointmentPayload),
    });
  });

  it('throws an error when the response is not OK', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ appointment: null }),
    });

    await expect(
      getAppointment(mockUrl, mockCode, mockAppointmentPayload),
    ).rejects.toThrow('Failed to get appointment: 400 Bad Request');
  });
});
