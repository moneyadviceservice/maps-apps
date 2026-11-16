import { CalendarLegendItem } from './types';

export const dayPickerClassNames = {
  root: 'w-full max-w-[525px] text-sm sm:text-base flex flex-col gap-4',
  months:
    'relative flex flex-wrap gap-6 max-w-[fit-content] border p-5 px-4 sm:px-6',
  nav: 'absolute top-5 left-5 right-5 flex h-[29px] sm:h-[53px] items-center justify-between',
  month_caption:
    'flex items-center justify-center h-[29px] sm:h-[53px] p-0 md:text-2xl text-blue-700 font-bold',
  month_grid:
    'w-full table-fixed border-separate border-spacing-1 sm:w-auto sm:border-spacing-2',
  weekday:
    'h-[32px] w-auto text-[12px] font-normal sm:h-[48px] sm:w-[60px] sm:text-base',
  day: 'p-0 align-top',
  chevron: 'w-5 h-5 fill-current',
};

export const calendarLegendSwatchClasses: Record<
  CalendarLegendItem['key'],
  string
> = {
  unavailable: 'border-gray-800 bg-gray-150',
  available: 'border-magenta-500 bg-white',
  selected: 'border-magenta-500 bg-magenta-500',
};
