import { Entry } from '@maps-react/mhf/types';
import { Language } from '@maps-react/utils/language/language';

import {
  AppointmentPayload,
  BookingSlotsPayload,
  BookingSlotsResponse,
  getAppointment,
  getBookingSlots,
} from '../api';
import {
  mockAppointmentPayload,
  mockAppointmentResponse,
} from '../api/getAppointment.test';
import { AsyncAction, FlowName } from '../constants';
import { submitActionHandlerMap } from './submitHandlers';

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getBookingSlots: jest.fn(),
  getAppointment: jest.fn(),
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

const mockBookingSlotsPayload: BookingSlotsPayload = {
  appointmentType: FlowName.PENSION_WISE,
  appointmentLanguage: 'en' as Language,
  medium: 'phone',
  isDoubleSlot: false,
};

const mockBookingSlotsResponse: BookingSlotsResponse = {
  bookingSlots: [
    {
      startDateTime: '2026-07-14T08:10:00Z',
      slotIds: [{ slotId: 'slot-1' }],
    },
  ],
  status: true,
  message: 0,
};

describe('BOOKING_AVAILABILITY', () => {
  beforeEach(() => {
    process.env.BOOKING_SLOTS_CODE = mockCode;
    process.env.BOOKING_SLOTS_URL = mockUrl;
    jest.mocked(getBookingSlots).mockReset();
  });

  it('throws an error if entry is not provided', async () => {
    await expect(
      submitActionHandlerMap[AsyncAction.BOOKING_AVAILABILITY]({
        entry: undefined as unknown as Entry,
        payload: mockBookingSlotsPayload,
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
          payload: mockBookingSlotsPayload,
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
    jest
      .mocked(getBookingSlots)
      .mockResolvedValueOnce(mockBookingSlotsResponse);

    const result = await submitActionHandlerMap[
      AsyncAction.BOOKING_AVAILABILITY
    ]({
      entry: ctx.entry,
      payload: mockBookingSlotsPayload,
    });

    expect(getBookingSlots).toHaveBeenCalledWith(
      mockUrl,
      mockCode,
      mockBookingSlotsPayload,
    );
    expect(result).toEqual({
      bookingSlots: mockBookingSlotsResponse.bookingSlots,
    });
  });
});
describe('APPOINTMENT_LOOKUP', () => {
  beforeEach(() => {
    process.env.APPOINTMENT_CODE = mockCode;
    process.env.APPOINTMENT_URL = mockUrl;
    jest.mocked(getAppointment).mockReset();
  });

  it('throws an error if payload is not provided', async () => {
    await expect(
      submitActionHandlerMap[AsyncAction.APPOINTMENT_LOOKUP]({
        entry: ctx.entry,
        payload: undefined as unknown as AppointmentPayload,
      }),
    ).rejects.toThrow('Get appointment payload is required');
  });

  it('throws an error if the API code or URL is not set', async () => {
    const originalUrl = process.env.APPOINTMENT_URL;
    const originalCode = process.env.APPOINTMENT_CODE;
    process.env.APPOINTMENT_URL = '';
    process.env.APPOINTMENT_CODE = '';

    try {
      await expect(
        submitActionHandlerMap[AsyncAction.APPOINTMENT_LOOKUP]({
          entry: ctx.entry,
          payload: mockAppointmentPayload,
        }),
      ).rejects.toThrow(
        'API code or URL for get appointment is not set in environment variables',
      );
    } finally {
      process.env.APPOINTMENT_URL = originalUrl;
      process.env.APPOINTMENT_CODE = originalCode;
    }
  });

  it('passes the configured API details and payload to getAppointment and returns its response', async () => {
    jest.mocked(getAppointment).mockResolvedValueOnce(mockAppointmentResponse);

    const result = await submitActionHandlerMap[AsyncAction.APPOINTMENT_LOOKUP](
      {
        entry: ctx.entry,
        payload: mockAppointmentPayload,
      },
    );

    expect(getAppointment).toHaveBeenCalledWith(
      process.env.APPOINTMENT_URL,
      process.env.APPOINTMENT_CODE,
      mockAppointmentPayload,
    );
    expect(result).toEqual(mockAppointmentResponse);
  });
});
