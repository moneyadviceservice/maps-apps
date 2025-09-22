import { Partner } from 'lib/types/aboutYou';
import { updatePartnerInformation } from './about-you';
const sessionId = 'test-session-id';
describe('updatePartnerInformation', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call fetch with correct URL and payload', async () => {
    const partners: Partner[] = [
      {
        id: 1,
        name: 'Jane Doe',
        dob: { day: '15', month: '06', year: '1980' },
        gender: 'female',
        retireAge: '65',
      },
    ];

    await updatePartnerInformation(partners, sessionId);

    expect(fetch).toHaveBeenCalledWith('/api/set-partner-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partners, sessionId }),
    });
  });

  it('should handle fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error')),
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const partners: Partner[] = [
      {
        id: 2,
        name: 'John Smith',
        dob: { day: '01', month: '01', year: '1975' },
        gender: 'male',
        retireAge: '67',
      },
    ];

    await updatePartnerInformation(partners, sessionId);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error calling API:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
