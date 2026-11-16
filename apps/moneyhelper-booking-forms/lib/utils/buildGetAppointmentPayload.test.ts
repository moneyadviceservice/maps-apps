import { FormFieldName } from '../constants';
import { BookingEntry } from '../types';
import { buildGetAppointmentPayload } from './buildGetAppointmentPayload';

describe('buildGetAppointmentPayload', () => {
  const createEntry = (data: Partial<BookingEntry['data']>): BookingEntry =>
    ({
      data: {
        flow: 'pw',
        locale: 'en',
        ...data,
      },
    } as BookingEntry);

  it('builds the appointment lookup payload and pads single-digit date values', () => {
    const entry = createEntry({
      [FormFieldName.APPOINTMENT_ID]: 'APT-000000008',
      day: '5',
      month: '3',
      year: '1980',
    });

    expect(buildGetAppointmentPayload(entry)).toEqual({
      appointmentId: 'APT-000000008',
      dob: '1980-03-05',
    });
  });

  it('throws when the booking entry is missing', () => {
    expect(() =>
      buildGetAppointmentPayload(undefined as unknown as BookingEntry),
    ).toThrow('Booking entry is required');
  });

  it.each([
    ['day', { day: undefined }],
    ['month', { month: undefined }],
    ['year', { year: undefined }],
  ])('throws when the date of birth %s is missing', (_field, missingField) => {
    const entry = createEntry({
      [FormFieldName.APPOINTMENT_ID]: 'APT-000000008',
      day: '5',
      month: '3',
      year: '1980',
      ...missingField,
    });

    expect(() => buildGetAppointmentPayload(entry)).toThrow(
      'Date of birth is required to look up an appointment',
    );
  });
});
