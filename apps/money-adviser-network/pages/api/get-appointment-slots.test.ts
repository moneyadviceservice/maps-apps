import { NextApiRequest, NextApiResponse } from 'next';

import handler from './get-appointment-slots';

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe('API Handler: Get Booking Slots', () => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn(() => ({ json: mockJson }));
  const mockRes = { status: mockStatus } as unknown as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.APPOINTMENTS_API = 'http://mock-api/';
    process.env.FETCH_APPOINTMENT_SLOTS_CODE = 'mockCode';
  });

  it('should return 400 if required environment variables are missing', async () => {
    delete process.env.FETCH_APPOINTMENT_SLOTS_CODE;

    const req = {} as NextApiRequest;
    await handler(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Missing required parameters: FETCH_APPOINTMENT_SLOTS_CODE',
    });
  });

  it('should return 500 if fetch throws an error', async () => {
    const req = {} as NextApiRequest;
    mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

    await handler(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(console.error).toHaveBeenCalledWith(
      'Error calling external API:',
      new Error('Fetch failed'),
    );
  });

  it('should return an error response if external API returns non-2xx status', async () => {
    const req = {} as NextApiRequest;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await handler(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Error from external API: Not Found',
    });
  });

  it('should return 200 and the data from the external API on success', async () => {
    const req = {} as NextApiRequest;
    const mockData = [{ SlotName: 'Slot1', SlotType: 'Type1' }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await handler(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockData);
  });
});
