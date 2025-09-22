import { monthlyData, TimelineData, weeklyData } from 'data/timelines';
import {
  addMonths,
  addWeeks,
  format,
  isValid,
  parse,
  subWeeks,
} from 'date-fns';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export function parseDateString(dateString: string): Date {
  try {
    // Try ISO-style first (yyyy-MM-dd), used in tabs
    let parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());

    if (!isValid(parsedDate)) {
      // Fallback to form-style (dd-MM-yyyy), used in landing page
      parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
    }

    if (!isValid(parsedDate)) {
      console.error('Invalid date parsed:', dateString);
      return new Date(); // Fallback
    }

    return parsedDate;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return new Date(); // Fallback
  }
}

function formatDateToDisplay(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'cy' ? 'cy' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }).format(date);
}

export function getPastDateByWeeks(dateString: string, weeks: number): Date {
  const date = parseDateString(dateString);
  return subWeeks(date, weeks);
}

export function mapEventDateWeekTimeline(
  dateString: string,
  z: ReturnType<typeof useTranslation>['z'],
  locale: string,
) {
  const eventDate = parseDateString(dateString);

  return weeklyData(z).map((event) => {
    const adjustedDate = addWeeks(eventDate, event.offset);
    return {
      ...event,
      date: format(adjustedDate, 'dd/MM/yy'),
      dateFormatted: formatDateToDisplay(adjustedDate, locale),
    };
  });
}

export function mapEventDateMonthTimeline(
  dateString: string,
  z: ReturnType<typeof useTranslation>['z'],
  locale: string,
) {
  const eventDate = parseDateString(dateString);

  return monthlyData(z).map((event) => {
    const adjustedDate = addMonths(eventDate, event.offset);
    return {
      ...event,
      date: format(adjustedDate, 'dd/MM/yy'),
      dateFormatted: formatDateToDisplay(adjustedDate, locale),
    };
  });
}

export interface TimelineDataResult extends TimelineData {
  date: string;
  dateFormatted: string;
}

export function getAllEvents(
  dateString: string,
  z: ReturnType<typeof useTranslation>['z'],
  locale: string,
) {
  // Calculate 40 weeks back from the due date
  const pastDate = getPastDateByWeeks(dateString, 40);

  // Convert pastDate back to string in correct format
  const pastDateString = format(pastDate, 'dd-MM-yyyy');

  const weekly = mapEventDateWeekTimeline(pastDateString, z, locale);
  const monthly = mapEventDateMonthTimeline(dateString, z, locale);

  return [...weekly, ...monthly];
}

export function mapEventDates(
  dateString: string,
  currentTab: number,
  z: ReturnType<typeof useTranslation>['z'],
  locale: string,
): TimelineDataResult[] {
  const events = getAllEvents(dateString, z, locale);
  return events.filter((item) => item.tab === currentTab);
}
