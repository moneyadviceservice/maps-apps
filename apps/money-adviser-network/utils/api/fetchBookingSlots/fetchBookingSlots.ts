import { Answer } from '@maps-react/form/types';

import { APIS } from '../../../CONSTANTS';
import { formatBookingSlotText } from '../formatBookingSlotText';

export type Slot = {
  SlotName: string;
  ReaminingCapacity: string;
  SlotType: string;
};

export const fetchBookingSlots = async (
  lang: string,
  baseUrl: string,
): Promise<{
  answers?: Answer[];
  error?: string;
}> => {
  try {
    const response = await fetch(`${baseUrl}/${APIS.GET_APPOINMENTS}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch slots: ${response.statusText}`);
    }

    const slots: Slot[] = await response.json();

    const answers: Answer[] = slots.map(
      (slot): Answer => ({
        text: formatBookingSlotText(slot.SlotName, lang),
        value: slot.SlotName,
        availability: slot.ReaminingCapacity,
        disabled: slot.ReaminingCapacity === '0',
      }),
    );

    return { answers };
  } catch (error) {
    console.error('Error fetching booking slots:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred.',
    };
  }
};
