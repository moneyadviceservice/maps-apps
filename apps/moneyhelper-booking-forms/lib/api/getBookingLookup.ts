import { ResponseData } from '../types';

type BookingLookupResponse = ResponseData & {
  data: {
    flow: string;
    referenceNumber: string;
    accessSupportStatus: string;
    accessOptionsRequest: string;
    appointmentDate: string;
    appointmentSlotSelection: string;
  };
};

export const getBookingLookup = async (): Promise<BookingLookupResponse> => ({
  status: 'true',
  message: 0,
  data: {
    flow: 'ds',
    referenceNumber: 'DS-123456',
    accessSupportStatus: 'yes',
    accessOptionsRequest: 'welsh-speaking-pension-specialist',
    appointmentDate: '2026-07-24',
    appointmentSlotSelection: '886313e1-3b8a-5372-9b90-0c9aee199e5d::12:00',
  },
});
