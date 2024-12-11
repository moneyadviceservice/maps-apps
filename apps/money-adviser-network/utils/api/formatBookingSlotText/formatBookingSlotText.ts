export const formatBookingSlotText = (slot: string, lang: string): string => {
  const slotRegex = /Booking Slot (\w+) - (\d{2}-\d{2}-\d{4})/;
  const match = slotRegex.exec(slot);
  if (!match) {
    console.error('Invalid slot format');

    return slot;
  }

  const [, period, rawDate] = match;

  const [day, month, year] = rawDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const weekday = date.toLocaleDateString(`${lang}-GB`, { weekday: 'long' });
  const monthName = date.toLocaleDateString(`${lang}-GB`, { month: 'long' });
  const dayNumber = date.getDate();

  const toString = lang === 'cy' ? 'i' : 'to';

  let timeRange = '';
  if (period === 'AM') {
    timeRange = `9am ${toString} 12pm`;
  } else if (period === 'PM') {
    timeRange = `1pm ${toString} 4pm`;
  } else {
    console.error('Invalid slot format');

    return slot;
  }

  return `${weekday} ${dayNumber} ${monthName} - ${timeRange}`;
};
