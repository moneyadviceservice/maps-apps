import { allSubmitErrors } from '../../../../data/errors';
import { isInOfficeHours } from '../../../../utils/isInOfficeHours';

export const getSlot = (
  rawSlot?: string,
  isOnlineFlow?: boolean,
  overrideOfficeHours?: boolean,
) => {
  let formattedSlotDate = '';
  let slotType = '';

  if (rawSlot) {
    const rawSlotRegex = /(AM|PM) - (\d{2}-\d{2}-\d{4})/;
    const match = rawSlotRegex.exec(rawSlot);
    if (match) {
      slotType = match[1];
      const [day, month, year] = match[2].split('-');
      formattedSlotDate = `${day}/${month}/${year}`;
    } else {
      console.error(`Invalid slot format: ${rawSlot}`);
      return { error: allSubmitErrors.invalidSlotFormat };
    }
  } else {
    slotType = isOnlineFlow ? 'digital' : 'IMMEDIATE';

    if (!isOnlineFlow && !isInOfficeHours() && !overrideOfficeHours) {
      return { error: allSubmitErrors.outOfOfficeHours };
    }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    formattedSlotDate = `${day}/${month}/${year}`;
  }

  return { slotType, formattedSlotDate };
};
