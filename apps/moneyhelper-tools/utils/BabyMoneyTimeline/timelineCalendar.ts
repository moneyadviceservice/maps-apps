import { TranslationGroup } from 'data/types';
import { v4 as uuidv4 } from 'uuid';

import useTranslation from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getAllEvents, TimelineDataResult } from './timeline';

/**
 *
 * @return VCALENDAR iCal file.<br/>
 * <pre>
 BEGIN:VCALENDAR
 PRODID:-//Money Helper//Baby Money Timeline Version 1.0//EN
 VERSION:2.0
 BEGIN:VEVENT
 DTSTAMP:20181124T153543Z
 DTSTART:20190915T000000
 DTEND:20190915T000000
 SUMMARY:summary
 URL:https://www.moneyhelper.org.uk
 UID:uuid
 END:VEVENT
 END:VCALENDAR
 * </pre>
 */
export const createEvent = (
  events: TimelineDataResult[],
  locale: keyof TranslationGroup,
) => {
  const formatDate = (d?: string): string => {
    let date = new Date();
    if (d) {
      const formatted = d.split('/');
      date = new Date(`${formatted[1]}/${formatted[0]}/${formatted[2]}`);
    }

    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return `${year}${month}${day}T${hour}${minutes}${seconds}`;
  };

  let VCALENDAR = `BEGIN:VCALENDAR
    PRODID:-//Money Helper//Baby Money Timeline Version 1.0//EN
    VERSION:2.0
    `.replace(/^ +/gm, '');

  for (const event of events) {
    const timeStamp = formatDate();
    const uuid = `${timeStamp}Z-uid@${uuidv4()}`;
    const EVENT = `BEGIN:VEVENT
      DTSTAMP:${formatDate(event.date)}
      DTSTART:${formatDate(event.date)}
      DTEND:${formatDate(event.date)}
      SUMMARY:${event.title}
      URL:https://www.moneyhelper.org.uk/${locale}/family-and-care/becoming-a-parent/baby-money-timeline
      UID:${uuid}
      END:VEVENT`.replace(/^ +/gm, '');
    VCALENDAR += `${EVENT}\n`;
  }
  VCALENDAR += `END:VCALENDAR`;

  return VCALENDAR;
};

export const encode = (text: string) => {
  return 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
};

export const createCalendarURL = (
  queryData: DataFromQuery,
  locale: keyof TranslationGroup,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const allEvents = getAllEvents(
    `${queryData['year']}-${queryData['month']}-${queryData['day']}`,
    z,
  );

  return encode(createEvent(allEvents, locale));
};
