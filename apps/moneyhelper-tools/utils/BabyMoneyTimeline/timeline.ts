import {
  monthlyData,
  monthsShorthand,
  TimelineData,
  weeklyData,
} from 'data/baby-money-timeline/timelines';

import useTranslation from '@maps-react/hooks/useTranslation';

export function getPastDateByWeeks(startDate: Date, weeks: number): Date {
  const pastDate = new Date(startDate);
  pastDate.setDate(pastDate.getDate() - weeks * 7);
  return pastDate;
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

function formatDate(date: string, z: ReturnType<typeof useTranslation>['z']) {
  const d = date.split('/');
  const monthIndex = d[1].replace(/^0+/, '');
  const month = monthsShorthand[Number(monthIndex) - 1];
  return `${d[0]} ${z(month)} ${d[2]}`;
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
  const weekly = mapEventDateWeekTimeline(
    getPastDateByWeeks(new Date(eventDate), 40),
    z,
  );

  const monthly = mapEventDateMonthTimeline(new Date(eventDate), z);

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
