import { useTranslation } from '@maps-react/hooks/useTranslation';

import type { OpeningTimes } from '../../utils/FuelFinder/types';

interface OpeningHoursProps {
  hours: OpeningTimes;
}

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const OpeningHours = ({ hours }: OpeningHoursProps) => {
  const { z } = useTranslation();

  const dayLabels: Record<string, string> = {
    monday: z({ en: 'Monday', cy: 'Dydd Llun' }),
    tuesday: z({ en: 'Tuesday', cy: 'Dydd Mawrth' }),
    wednesday: z({ en: 'Wednesday', cy: 'Dydd Mercher' }),
    thursday: z({ en: 'Thursday', cy: 'Dydd Iau' }),
    friday: z({ en: 'Friday', cy: 'Dydd Gwener' }),
    saturday: z({ en: 'Saturday', cy: 'Dydd Sadwrn' }),
    sunday: z({ en: 'Sunday', cy: 'Dydd Sul' }),
  };

  if (!hours?.usual_days) {
    return (
      <p className="text-sm text-gray-600">
        {z({
          en: 'No opening hours listed.',
          cy: 'Dim oriau agor wedi\u2019u rhestru.',
        })}
      </p>
    );
  }

  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayKey = DAY_ORDER[todayIndex];

  return (
    <div className="space-y-1" data-testid="opening-hours">
      {DAY_ORDER.map((day) => {
        const dayHours = hours.usual_days[day];
        if (!dayHours) return null;

        const timeDisplay = dayHours.is_24_hours
          ? z({ en: '24 hours', cy: '24 awr' })
          : `${dayHours.open.slice(0, 5)} – ${dayHours.close.slice(0, 5)}`;

        return (
          <div
            key={day}
            className={`flex justify-between text-sm ${
              day === todayKey ? 'font-semibold' : ''
            }`}
          >
            <span>{dayLabels[day]}</span>
            <span>{timeDisplay}</span>
          </div>
        );
      })}
      {hours.bank_holiday && (
        <div className="pt-2 mt-2 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{z({ en: 'Bank Holiday', cy: 'Gŵyl Banc' })}</span>
            <span>
              {hours.bank_holiday.is_24_hours
                ? z({ en: '24 hours', cy: '24 awr' })
                : `${hours.bank_holiday.open_time.slice(
                    0,
                    5,
                  )} – ${hours.bank_holiday.close_time.slice(0, 5)}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningHours;
