import { Entry } from '@maps-react/mhf/types';
import { type Language } from '@maps-react/utils/language';

import { getBookingSlots } from '../api';
import type {
  BookingSlotsPayload,
  BookingSlotsResponse,
} from '../api/getBookingSlots';
import { AsyncAction, FlowName } from '../constants';
import { submitActionHandlerMap } from './submitHandlers';

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getBookingSlots: jest.fn(),
}));

const mockCode = 'test-code';
const mockUrl = 'https://mock-api/submit';

const ctx = {
  entry: {
    data: { flow: FlowName.PENSION_WISE, locale: 'en' },
    stepIndex: 0,
    steps: [],
    errors: {},
  } as Entry,
};
beforeAll(() => {
  process.env.BOOKING_SLOTS_CODE = mockCode;
  process.env.BOOKING_SLOTS_URL = mockUrl;
});

describe('BOOKING_AVAILABILITY', () => {
  beforeEach(() => {
    jest.mocked(getBookingSlots).mockReset();
  });

  const mockPayload: BookingSlotsPayload = {
    appointmentType: FlowName.PENSION_WISE,
    appointmentLanguage: 'en' as Language,
    medium: 'phone',
    isDoubleSlot: false,
  };

  it('throws an error if entry is not provided', async () => {
    await expect(
      submitActionHandlerMap[AsyncAction.BOOKING_AVAILABILITY]({
        entry: undefined as unknown as Entry,
        payload: mockPayload,
      }),
    ).rejects.toThrow('Booking entry is required');
  });

  it('throws an error if payload is not provided', async () => {
    await expect(
      submitActionHandlerMap[AsyncAction.BOOKING_AVAILABILITY]({
        entry: ctx.entry,
        payload: undefined as unknown as BookingSlotsPayload,
      }),
    ).rejects.toThrow('Booking slots payload is required');
  });

  it('throws an error if the API code or URL is not set', async () => {
    const originalUrl = process.env.BOOKING_SLOTS_URL;
    const originalCode = process.env.BOOKING_SLOTS_CODE;
    process.env.BOOKING_SLOTS_URL = '';
    process.env.BOOKING_SLOTS_CODE = '';

    try {
      await expect(
        submitActionHandlerMap[AsyncAction.BOOKING_AVAILABILITY]({
          entry: ctx.entry,
          payload: mockPayload,
        }),
      ).rejects.toThrow(
        'API code or URL for booking slots is not set in environment variables',
      );
    } finally {
      process.env.BOOKING_SLOTS_URL = originalUrl;
      process.env.BOOKING_SLOTS_CODE = originalCode;
    }
  });

  it('passes the configured API details and payload to getBookingSlots and returns its response', async () => {
    const mockResponse: BookingSlotsResponse = {
      bookingSlots: [
        {
          startDateTime: '2026-07-14T08:10:00Z',
          slotIds: [{ slotId: 'slot-1' }],
        },
      ],
      status: true,
      message: 0,
    };
    jest.mocked(getBookingSlots).mockResolvedValueOnce(mockResponse);

    const result = await submitActionHandlerMap[
      AsyncAction.BOOKING_AVAILABILITY
    ]({
      entry: ctx.entry,
      payload: mockPayload,
    });

    expect(getBookingSlots).toHaveBeenCalledWith(
      mockUrl,
      mockCode,
      mockPayload,
    );
    expect(result).toEqual({
      bookingSlots: mockResponse.bookingSlots,
    });
  });
});
