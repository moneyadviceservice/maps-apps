export const appointmentResponses = {
  success: {
    code: 200,
    message: 'Success',
  },
  outOfHours: {
    code: 400,
    message: 'Out of office hours',
  },
  noSlotsAvailable: {
    code: 400,
    message:
      'There are no telephone slots available. Please try again tomorrow. Alternatively, you can select the online advice tool.',
  },
  capacityFull: {
    code: 400,
    message: 'Error - Booking slot capacity is full.',
  },
} satisfies Record<string, TAppointmentResponse>;

export type TAppointmentResponse = {
  code: number;
  message: string;
};
