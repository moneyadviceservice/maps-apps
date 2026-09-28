import { GetBookingSlotsResponse } from '../types';
import {
  decodeSlotSelection,
  encodeSlotSelection,
  transformAppointmentData,
  transformDate,
} from './transformAppointmentData';

describe('transformAppointmentData utils', () => {
  describe('encodeSlotSelection/decodeSlotSelection', () => {
    it('encodes and decodes slot selection values', () => {
      const encoded = encodeSlotSelection('slot-123', '08:10');

      expect(encoded).toBe('slot-123::08:10');
      expect(decodeSlotSelection(encoded)).toEqual({
        slotId: 'slot-123',
        timeLabel: '08:10',
      });
    });

    it('returns null for invalid selection values', () => {
      expect(decodeSlotSelection()).toBeNull();
      expect(decodeSlotSelection('')).toBeNull();
      expect(decodeSlotSelection('slot-123')).toBeNull();
      expect(decodeSlotSelection('::08:10')).toBeNull();
      expect(decodeSlotSelection('slot-123::')).toBeNull();
    });
  });

  describe('transformAppointmentData', () => {
    it('throws an error when API status is false', () => {
      const response: GetBookingSlotsResponse = {
        status: false,
        message: 500,
        bookingSlots: [],
      };

      expect(() => transformAppointmentData(response)).toThrow('500');
    });

    it('uses only the first slotId, groups by date, and sorts days ascending', () => {
      const response: GetBookingSlotsResponse = {
        status: true,
        message: 200,
        bookingSlots: [
          {
            startDateTime: '2026-01-02T10:30:00.000Z',
            slotIds: [{ slotId: 'slot-b-1' }],
          },
          {
            startDateTime: '2026-01-01T08:10:00.000Z',
            slotIds: [{ slotId: 'slot-a-1' }, { slotId: 'slot-a-2' }],
          },
          {
            startDateTime: '2026-01-01T09:45:00.000Z',
            slotIds: [{ slotId: 'slot-a-3' }],
          },
        ],
      };

      const result = transformAppointmentData(response);

      expect(result.days.map((day) => day.date)).toEqual([
        '2026-01-01',
        '2026-01-02',
      ]);

      const firstDaySlots = result.days[0].slots;
      expect(firstDaySlots).toHaveLength(2);
      expect(firstDaySlots[0].id).toContain('slot-a-1::');
      expect(firstDaySlots[0].id).not.toContain('slot-a-2');
      expect(firstDaySlots[0].time).toMatch(/^\d{2}:\d{2}$/);
      expect(firstDaySlots[1].id).toContain('slot-a-3::');
      expect(firstDaySlots[1].time).toMatch(/^\d{2}:\d{2}$/);

      const secondDaySlots = result.days[1].slots;
      expect(secondDaySlots).toHaveLength(1);
      expect(secondDaySlots[0].id).toContain('slot-b-1::');
      expect(secondDaySlots[0].time).toMatch(/^\d{2}:\d{2}$/);
    });

    it('skips booking slots that have no slotIds or empty first slotId', () => {
      const response: GetBookingSlotsResponse = {
        status: true,
        message: 200,
        bookingSlots: [
          {
            startDateTime: '2026-01-01T08:10:00.000Z',
            slotIds: [],
          },
          {
            startDateTime: '2026-01-01T09:10:00.000Z',
            slotIds: [{ slotId: '' }],
          },
          {
            startDateTime: '2026-01-01T10:10:00.000Z',
            slotIds: [{ slotId: 'slot-valid' }],
          },
        ],
      };

      const result = transformAppointmentData(response);

      expect(result.days).toHaveLength(1);
      expect(result.days[0].date).toBe('2026-01-01');
      expect(result.days[0].slots).toHaveLength(1);
      expect(result.days[0].slots[0].id).toContain('slot-valid::');
    });
  });

  describe('transformDate', () => {
    it.each([
      {
        locale: 'en' as const,
        expectedDate: 'Tuesday, 14 July 2026',
      },
      {
        locale: 'cy' as const,
        expectedDate: 'Dydd Mawrth, 14 Gorffennaf 2026',
      },
    ])('formats appointment date in $locale', ({ locale, expectedDate }) => {
      expect(transformDate('2026-07-14', locale)).toBe(expectedDate);
    });

    it('falls back to the raw appointment date when it cannot be parsed', () => {
      expect(transformDate('not-a-date', 'en')).toBe('not-a-date');
    });
  });
});
