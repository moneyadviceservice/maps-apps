import { AppointmentAvailabilityResponse } from '../types';
import {
  buildAppointmentCalendarState,
  fromDateKey,
  toDateKey,
} from './buildAppointmentCalendarState';

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
    const availabilityData: AppointmentAvailabilityResponse = {
      days: [
        {
          date: '2026-07-14',
          slots: [
            { id: 'slot-1', time: '08:10am' },
            { id: 'slot-2', time: '09:30am' },
          ],
        },
        {
          date: '2026-07-15',
          slots: [{ id: 'slot-3', time: '10:45am' }],
        },
      ],
    };

    it('derives selected date data and slot options when a date is selected', () => {
      const selected = new Date(2026, 6, 14);
      const expectedLabel = selected.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      const result = buildAppointmentCalendarState({
        availabilityData,
        localeCode: 'en-GB',
        selected,
      });

      expect(result.availableDateKeys.has('2026-07-14')).toBe(true);
      expect(result.availableDateKeys.has('2026-07-15')).toBe(true);
      expect(result.selectedDateKey).toBe('2026-07-14');
      expect(result.selectedDateLabel).toBe(expectedLabel);
      expect(result.selectedSlots).toEqual([
        { id: 'slot-1', time: '08:10am' },
        { id: 'slot-2', time: '09:30am' },
      ]);
      expect(result.timeOptions).toEqual([
        { text: '08:10am', value: 'slot-1' },
        { text: '09:30am', value: 'slot-2' },
      ]);
      expect(result.slotsByDate.get('2026-07-15')).toEqual([
        { id: 'slot-3', time: '10:45am' },
      ]);
    });

    it('returns empty selected values when no date is selected', () => {
      const result = buildAppointmentCalendarState({
        availabilityData,
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
        availabilityData,
        localeCode: 'en-GB',
        selected,
      });

      expect(result.selectedDateKey).toBe('2026-07-20');
      expect(result.selectedSlots).toEqual([]);
      expect(result.timeOptions).toEqual([]);
    });
  });
});
