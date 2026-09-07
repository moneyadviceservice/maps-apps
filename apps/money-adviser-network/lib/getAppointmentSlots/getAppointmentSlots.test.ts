import { formatBookingSlotText } from '../../utils/formatBookingSlotText';
import { getAppointmentSlots } from './getAppointmentSlots';

jest.mock('../../utils/formatBookingSlotText', () => ({
  formatBookingSlotText: jest.fn(),
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe('getAppointmentSlots', () => {
  const lang = 'en';
  const mockSlot = {
    SlotName: 'Test Slot',
    ReaminingCapacity: '5',
    SlotType: 'Standard',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FETCH_APPOINTMENT_SLOTS_CODE = 'test-code';
    process.env.APPOINTMENTS_API = 'https://api.example.com/';
  });

  it('returns formatted answers on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([mockSlot]),
    } as unknown as Response);

    (formatBookingSlotText as jest.Mock).mockReturnValue('Formatted Slot');

    const result = await getAppointmentSlots(lang);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('GetBookingSlots?code=test-code'),
    );

    expect(formatBookingSlotText).toHaveBeenCalledWith('Test Slot', true, lang);

    expect(result).toEqual({
      answers: [
        {
          text: 'Formatted Slot',
          value: 'Test Slot',
          availability: '5',
          disabled: false,
        },
      ],
    });
  });

  it('returns an error if FETCH_APPOINTMENT_SLOTS_CODE is missing', async () => {
    delete process.env.FETCH_APPOINTMENT_SLOTS_CODE;

    const result = await getAppointmentSlots(lang);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: 'Failed to fetch appointment slots',
    });
  });

  it('returns an error if the API returns an error status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    } as Response);

    const result = await getAppointmentSlots(lang);

    expect(result).toEqual({
      error: 'Failed to fetch appointment slots',
    });
  });

  it('returns an error if the API response is not an array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ invalid: 'data' }),
    } as unknown as Response);

    const result = await getAppointmentSlots(lang);

    expect(result).toEqual({
      error: 'Failed to fetch appointment slots',
    });
  });

  it('returns an error if no slots are available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([]),
    } as unknown as Response);

    const result = await getAppointmentSlots(lang);

    expect(result).toEqual({
      error: 'Failed to fetch appointment slots',
    });
  });

  it('handles exceptions and returns a generic error message', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getAppointmentSlots(lang);

    expect(result).toEqual({
      error: 'Failed to fetch appointment slots',
    });
  });

  it('disables slots with zero availability', async () => {
    const zeroSlot = { ...mockSlot, ReaminingCapacity: '0' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([zeroSlot]),
    } as unknown as Response);

    (formatBookingSlotText as jest.Mock).mockReturnValue('Disabled Slot');

    const result = await getAppointmentSlots(lang);

    expect(result).toEqual({
      answers: [
        {
          text: 'Disabled Slot',
          value: 'Test Slot',
          availability: '0',
          disabled: true,
        },
      ],
    });
  });
});
