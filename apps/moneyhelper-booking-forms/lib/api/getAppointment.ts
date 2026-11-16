import { Language } from '@maps-react/utils/language/language';

export type GetAppointmentResponse = {
  appointment: Appointment;
};

export type Appointment = {
  appointmentId: string;
  startDateTime: string;
  appointmentType: 'pw' | 'ds' | 'se' | 'pl' | 'psg';
  jurisdiction?: 'en' | 'sc';
  appointmentLanguage: Language;
  medium: 'phone' | 'video';
  isDoubleSlot: boolean;
  isBslRequired: boolean;
  isInterpreterRequired: boolean;
};

export type AppointmentPayload = {
  appointmentId: string;
  dob: string;
};

export const getAppointment = async (
  url: string,
  code: string,
  payload: AppointmentPayload,
): Promise<GetAppointmentResponse> => {
  const response = await fetch(`${url}?code=${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseData: GetAppointmentResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to get appointment: ${response.status} ${response.statusText}`,
    );
  }
  return responseData;
};
