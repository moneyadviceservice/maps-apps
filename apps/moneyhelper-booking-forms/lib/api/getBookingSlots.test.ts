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

export const mockBookingSlotsPayload: BookingSlotsPayload = {
  appointmentType: 'pension-wise',
  appointmentLanguage: 'en' as Language,
  medium: 'phone',
  isDoubleSlot: false,
};
export const mockBookingSlotsResponse: BookingSlotsResponse = {
  status: true,
  message: 0,
  bookingSlots: [
    {
      startDateTime: '2026-07-14T08:10:00Z',
      slotIds: [{ slotId: 'slot-1' }],
    },
  ],
};
describe('getBookingSlots', () => {
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
      json: async () => mockBookingSlotsResponse,
    });

    await expect(
      getBookingSlots(mockUrl, mockCode, mockBookingSlotsPayload),
    ).resolves.toEqual(mockBookingSlotsResponse);
  });

  it('sends the code and payload to the booking slots API', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockBookingSlotsResponse,
    });

    await getBookingSlots(mockUrl, mockCode, mockBookingSlotsPayload);

    expect(fetchSpy).toHaveBeenCalledWith(`${mockUrl}?code=${mockCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockBookingSlotsPayload),
    });
  });

  it('returns no booking slots when the API responds with 204', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: jest.fn(),
    });

    await expect(
      getBookingSlots(mockUrl, mockCode, mockBookingSlotsPayload),
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
      getBookingSlots(mockUrl, mockCode, mockBookingSlotsPayload),
    ).rejects.toThrow('400');
  });
});
