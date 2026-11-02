import {
  monthlyData,
  monthsShorthand,
  TimelineData,
  weeklyData,
} from 'data/timelines';
import { isValid, parse } from 'date-fns';

import useTranslation from '@maps-react/hooks/useTranslation';

export function parseDateString(dateString: string): Date {
  try {
    // Try ISO style first (yyyy-MM-dd)
    let parsed = parse(dateString, 'yyyy-MM-dd', new Date());

    if (!isValid(parsed)) {
      // Fallback to dd-MM-yyyy
      parsed = parse(dateString, 'dd-MM-yyyy', new Date());
    }

    if (!isValid(parsed)) {
      console.error('Invalid date parsed:', dateString);
      return new Date();
    }

    return parsed;
  } catch (err) {
    console.error('Error parsing date:', dateString, err);
    return new Date();
  }
}

export function getPastDateByWeeks(startDate: Date, weeks: number): Date {
  const pastDate = new Date(startDate);
  pastDate.setDate(pastDate.getDate() - weeks * 7);
  return pastDate;
}

function formatDate(date: string, z: ReturnType<typeof useTranslation>['z']) {
  const d = date.split('/');
  const monthIndex = d[1].replace(/^0+/, '');
  const month = monthsShorthand[Number(monthIndex) - 1];
  return `${d[0]} ${z(month)} ${d[2]}`;
}

export function mapEventDateWeekTimeline(
  eventDate: Date,
  z: ReturnType<typeof useTranslation>['z'],
) {
  return weeklyData(z).map((event) => {
    const eventDateCopy = new Date(eventDate);
    eventDateCopy.setDate(eventDateCopy.getDate() + event.offset * 7);

    const date = eventDateCopy.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    });

    return {
      ...event,
      date: date,
      dateFormatted: formatDate(date, z),
    };
  });
}

export function mapEventDateMonthTimeline(
  eventDate: Date,
  z: ReturnType<typeof useTranslation>['z'],
) {
  return monthlyData(z).map((event) => {
    const eventDateCopy = new Date(eventDate);
    eventDateCopy.setMonth(eventDateCopy.getMonth() + event.offset);

    const date = eventDateCopy.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    });

    return {
      ...event,
      date: date,
      dateFormatted: formatDate(date, z),
    };
  });
}

export interface TimelineDataResult extends TimelineData {
  date: string;
  dateFormatted: string;
}

export function getAllEvents(
  eventDate: string,
  z: ReturnType<typeof useTranslation>['z'],
) {
  const parsedDate = parseDateString(eventDate);

  const weekly = mapEventDateWeekTimeline(
    getPastDateByWeeks(parsedDate, 40),
    z,
  );

  const monthly = mapEventDateMonthTimeline(parsedDate, z);

  return [...weekly, ...monthly];
}

export function mapEventDates(
  eventDate: string,
  currentTab: number,
  z: ReturnType<typeof useTranslation>['z'],
): TimelineDataResult[] {
  const events = getAllEvents(eventDate, z);
  return events.filter((item) => item.tab === currentTab);
}
