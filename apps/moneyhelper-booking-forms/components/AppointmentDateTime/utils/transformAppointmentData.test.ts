import { BookingSlots } from '../../../lib/api';
import {
  getAppointmentSelectionValues,
  transformAppointmentData,
  transformDate,
} from './transformAppointmentData';

describe('transformAppointmentData utils', () => {
  describe('transformAppointmentData', () => {
    it('groups booking slots by date and sorts days ascending', () => {
      const bookingSlots: BookingSlots = [
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
      ];

      const result = transformAppointmentData(bookingSlots);

      expect(result.days.map((day) => day.date)).toEqual([
        '2026-01-01',
        '2026-01-02',
      ]);
      expect(result.days[0].slots).toEqual([bookingSlots[1], bookingSlots[2]]);
      expect(result.days[1].slots).toEqual([bookingSlots[0]]);
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

  describe('getAppointmentSelectionValues', () => {
    it('returns undefined for an empty value', () => {
      expect(getAppointmentSelectionValues('')).toBeUndefined();
    });

    it('parses a valid appointment slot selection', () => {
      const selection = {
        date: '2026-07-14',
        startDateTime: '2026-07-14T08:10:00Z',
        slotIds: [{ slotId: 'slot-1' }],
      };

      expect(getAppointmentSelectionValues(JSON.stringify(selection))).toEqual(
        selection,
      );
    });
  });
});
