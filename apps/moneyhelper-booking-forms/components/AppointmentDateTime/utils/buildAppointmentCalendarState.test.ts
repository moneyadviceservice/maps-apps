import type { AppointmentAvailability } from '../types';
import {
  buildAppointmentCalendarState,
  fromDateKey,
  toDateKey,
} from './buildAppointmentCalendarState';

const mockAvailabilityData: AppointmentAvailability = {
  days: [
    {
      date: '2026-07-14',
      slots: [
        {
          startDateTime: '2026-07-14T08:10:00Z',
          slotIds: [{ slotId: 'slot-1' }],
        },
        {
          startDateTime: '2026-07-14T09:30:00Z',
          slotIds: [{ slotId: 'slot-2' }],
        },
      ],
    },
    {
      date: '2026-07-15',
      slots: [
        {
          startDateTime: '2026-07-15T10:45:00Z',
          slotIds: [{ slotId: 'slot-3' }],
        },
      ],
    },
  ],
};

describe('AppointmentDateTime utils', () => {
  describe('toDateKey', () => {
    it('formats a date as YYYY-MM-DD with zero padding', () => {
      const date = new Date(2026, 0, 5);

      expect(toDateKey(date)).toBe('2026-01-05');
    });
  });

  describe('fromDateKey', () => {
    it('parses a valid date key into a Date', () => {
      const result = fromDateKey('2026-07-14');

      expect(result).toBeDefined();
      expect(result?.getFullYear()).toBe(2026);
      expect(result?.getMonth()).toBe(6);
      expect(result?.getDate()).toBe(14);
    });

    it('returns undefined for invalid input', () => {
      expect(fromDateKey()).toBeUndefined();
      expect(fromDateKey('')).toBeUndefined();
      expect(fromDateKey('not-a-date')).toBeUndefined();
      expect(fromDateKey('2026-07')).toBeUndefined();
    });
  });

  describe('buildAppointmentCalendarState', () => {
    it('derives selected date data and slot options when a date is selected', () => {
      const selected = new Date(2026, 6, 14);
      const expectedLabel = selected.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      const result = buildAppointmentCalendarState({
        availabilityData: mockAvailabilityData,
        localeCode: 'en-GB',
        selected,
      });

      expect(result.availableDateKeys.has('2026-07-14')).toBe(true);
      expect(result.availableDateKeys.has('2026-07-15')).toBe(true);
      expect(result.selectedDateKey).toBe('2026-07-14');
      expect(result.selectedDateLabel).toBe(expectedLabel);
      expect(result.timeOptions).toEqual([
        {
          text: '09:10',
          value:
            '{"date":"2026-07-14","startDateTime":"2026-07-14T08:10:00Z","slotIds":[{"slotId":"slot-1"}]}',
        },
        {
          text: '10:30',
          value:
            '{"date":"2026-07-14","startDateTime":"2026-07-14T09:30:00Z","slotIds":[{"slotId":"slot-2"}]}',
        },
      ]);
    });

    it('returns empty selected values when no date is selected', () => {
      const result = buildAppointmentCalendarState({
        availabilityData: mockAvailabilityData,
        localeCode: 'en-GB',
        selected: undefined,
      });

      expect(result.selectedDateKey).toBe('');
      expect(result.selectedDateLabel).toBe('');
      expect(result.selectedSlots).toEqual([]);
      expect(result.timeOptions).toEqual([]);
      expect(result.availableDateKeys.has('2026-07-14')).toBe(true);
    });

    it('returns empty selectedSlots when selected date is not in data', () => {
      const selected = new Date(2026, 6, 20);

      const result = buildAppointmentCalendarState({
        availabilityData: mockAvailabilityData,
        localeCode: 'en-GB',
        selected,
      });

      expect(result.selectedDateKey).toBe('2026-07-20');
      expect(result.selectedSlots).toEqual([]);
      expect(result.timeOptions).toEqual([]);
    });
  });
});
