import { Language } from '@maps-react/utils/language/language';

import {
  type BookingSlotsPayload,
  type BookingSlotsResponse,
  getBookingSlots,
} from './getBookingSlots';

const mockCode = 'test-code';
const mockUrl = 'https://mock-api/getBookingSlots';
let fetchSpy: jest.SpyInstance;

beforeAll(() => {
  process.env.BOOKING_SLOTS_CODE = mockCode;
  process.env.BOOKING_SLOTS_URL = mockUrl;
});

globalThis.fetch = jest.fn();

describe('getBookingSlots', () => {
  const mockPayload: BookingSlotsPayload = {
    appointmentType: 'pension-wise',
    appointmentLanguage: 'en' as Language,
    medium: 'phone',
    isDoubleSlot: false,
  };
  const mockResponse: BookingSlotsResponse = {
    status: true,
    message: 0,
    bookingSlots: [
      {
        startDateTime: '2026-07-14T08:10:00Z',
        slotIds: [{ slotId: 'slot-1' }],
      },
    ],
  };

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('returns booking slots when the API responds successfully', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    await expect(
      getBookingSlots(mockUrl, mockCode, mockPayload),
    ).resolves.toEqual(mockResponse);
  });

  it('sends the code and payload to the booking slots API', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    await getBookingSlots(mockUrl, mockCode, mockPayload);

    expect(fetchSpy).toHaveBeenCalledWith(`${mockUrl}?code=${mockCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });
  });

  it('returns no booking slots when the API responds with 204', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: jest.fn(),
    });

    await expect(
      getBookingSlots(mockUrl, mockCode, mockPayload),
    ).resolves.toEqual({
      status: true,
      message: 0,
      bookingSlots: [],
    });
  });

  it('throws an error with the API message when the response is not OK', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        status: false,
        message: 400,
        bookingSlots: [],
      }),
    });

    await expect(
      getBookingSlots(mockUrl, mockCode, mockPayload),
    ).rejects.toThrow('400');
  });
});
