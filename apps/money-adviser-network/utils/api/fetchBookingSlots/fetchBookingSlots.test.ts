import { APIS } from '../../../CONSTANTS';
import { fetchBookingSlots } from './fetchBookingSlots';

global.fetch = jest.fn();

const baseUrl = 'http://localhost:4350';

describe('fetchBookingSlots', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const API_URL = `${baseUrl}/${APIS.GET_APPOINMENTS}`;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return slots when the API call is successful', async () => {
    const mockSlots = [
      {
        SlotName: 'Morning',
        ReaminingCapacity: '5',
        SlotType: 'am',
      },
      {
        SlotName: 'Afternoon',
        ReaminingCapacity: '2',
        SlotType: 'pm',
      },
    ];

    const expected = [
      { text: 'Morning', availability: '5', value: 'Morning', disabled: false },
      {
        text: 'Afternoon',
        availability: '2',
        value: 'Afternoon',
        disabled: false,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockSlots),
    } as unknown as Response);

    const result = await fetchBookingSlots('en', baseUrl);

    expect(mockFetch).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual({ answers: expected });
  });

  it('should return an error message if the API response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    } as unknown as Response);

    const result = await fetchBookingSlots('en', baseUrl);

    expect(mockFetch).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual({
      error: 'Failed to fetch slots: Internal Server Error',
    });
  });

  it('should return an error message if fetch throws an error', async () => {
    const mockError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(mockError);

    const result = await fetchBookingSlots('en', baseUrl);

    expect(mockFetch).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual({ error: 'Network error' });
  });

  it('should return "Unknown error occurred." if an unexpected error occurs', async () => {
    mockFetch.mockRejectedValueOnce('Unexpected error');

    const result = await fetchBookingSlots('en', baseUrl);

    expect(mockFetch).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual({ error: 'Unknown error occurred.' });
  });
});
