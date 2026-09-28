import { addDays, addMonths, format } from 'date-fns';

export const getDefaultDueDate = (): string => {
  // Start from today, add 8 months, then 10 days
  const futureDate = addDays(addMonths(new Date(), 8), 10);
  // Format as DD-MM-YYYY (always pads day/month)
  return format(futureDate, 'dd-MM-yyyy');
};
