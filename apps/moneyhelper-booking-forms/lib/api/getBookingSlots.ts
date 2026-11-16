import { Language } from '@maps-react/utils/language';

export type BookingSlotsResponse = {
  status: boolean;
  message: number;
  bookingSlots: BookingSlots;
};

export type BookingSlots = {
  startDateTime: string;
  slotIds: {
    slotId: string;
    secondSlotId?: string;
  }[];
}[];

export type BookingSlotsPayloadBase = {
  appointmentType: string;
  appointmentLanguage: Language;
  jurisdiction?: string;
  medium: 'phone' | 'video' | 'f2f';
};

export type SingleSlotPayload = BookingSlotsPayloadBase & {
  isDoubleSlot: false;
};

export type DoubleSlotPayload = BookingSlotsPayloadBase & {
  isDoubleSlot: true;
  isBslRequired?: boolean;
  isInterpreterRequired?: boolean;
};

export type BookingSlotsPayload = SingleSlotPayload | DoubleSlotPayload;

export const getBookingSlots = async (
  url: string,
  code: string,
  payload: BookingSlotsPayload,
): Promise<BookingSlotsResponse> => {
  const response = await fetch(`${url}?code=${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 204) {
    return {
      status: true,
      message: 0,
      bookingSlots: [],
    };
  }

  const responseData: BookingSlotsResponse = await response.json();

  if (!response.ok) {
    throw new Error(String(responseData.message));
  }
  return responseData;
};
