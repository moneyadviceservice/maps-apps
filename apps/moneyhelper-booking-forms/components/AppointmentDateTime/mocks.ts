import { GetBookingSlotsResponse } from './types';

/**
 * TEMP MOCK DATA - this file will be replaced with a real API call to the backend in the future. TICKET NO: 49556
 *
 *
 * Mock payload mirroring GetBookingSlots API response shape.
 */
export const mockGetBookingSlotsResponse: GetBookingSlotsResponse = {
  status: true,
  message: 0,
  bookingSlots: [
    {
      startDateTime: '2026-07-23T09:00:00Z',
      slotIds: [
        {
          slotId: '550e8400-e29b-41d4-a716-446655440000',
          secondSlotId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        },
      ],
    },
    {
      startDateTime: '2026-07-23T10:00:00Z',
      slotIds: [
        {
          slotId: 'd9428888-122b-11e1-b85c-61cd3cbb3210',
          secondSlotId: '16fd2706-8baf-433b-82eb-8c7fada847da',
        },
      ],
    },
    {
      startDateTime: '2026-07-24T11:00:00Z',
      slotIds: [
        {
          slotId: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
          secondSlotId: '2d931510-d99f-494a-8c67-87feb05e1594',
        },
        {
          slotId: 'a987fbc9-4bed-3078-cf07-9141ba07c9f3',
          secondSlotId: '9f8c6f1e-7d4a-4c3b-9a8e-123456789abc',
        },
      ],
    },
  ],
};
