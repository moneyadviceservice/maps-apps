import { Answer } from '@maps-react/form/types';

import { formatBookingSlotText } from '../../utils/formatBookingSlotText';

export type Slot = {
  SlotName: string;
  ReaminingCapacity: string;
  SlotType: string;
};

async function apiHandler(): Promise<Slot[] | null> {
  const code = process.env.FETCH_APPOINTMENT_SLOTS_CODE;

  const date = new Date();
  const slotDate = date.toLocaleDateString('en-GB');

  if (!code) {
    console.error('Missing required parameters: FETCH_APPOINTMENT_SLOTS_CODE');
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.APPOINTMENTS_API}GetBookingSlots?code=${code}&slotDate=${slotDate}`,
    );

    if (!response.ok) {
      console.error(`Error from external API: ${response.statusText}`);
      return null;
    }

    const data: Slot[] = await response.json();

    if (!Array.isArray(data)) {
      console.error('Unexpected API response:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Internal Server Error fetching appointment slots:', error);

    return null;
  }
}

export const getAppointmentSlots = async (
  lang: string,
): Promise<{
  answers?: Answer[];
  error?: string;
}> => {
  const slots = await apiHandler();

  if (!slots || slots.length === 0) {
    return { error: 'Failed to fetch appointment slots' };
  }

  const answers: Answer[] = slots.map(
    ({ SlotName, ReaminingCapacity }): Answer => ({
      text: formatBookingSlotText(SlotName, ReaminingCapacity !== '0', lang),
      value: SlotName,
      availability: ReaminingCapacity,
      disabled: ReaminingCapacity === '0',
    }),
  );

  return { answers };
};
