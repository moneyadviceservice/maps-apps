import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import { defaultStatePensionData } from 'types/statePension';

import {
  getStatePensionFromSession,
  saveStatePensionToSession,
} from './statePensionSession';

jest.mock('lib/session/journeySession', () => ({
  getJourneySession: jest.fn(),
  updateJourneySession: jest.fn(),
}));

const mockedGet = getJourneySession as jest.MockedFunction<
  typeof getJourneySession
>;
const mockedUpdate = updateJourneySession as jest.MockedFunction<
  typeof updateJourneySession
>;

describe('statePensionSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the stored weekly amount', async () => {
    mockedGet.mockResolvedValue({ statePension: { weeklyAmount: '180' } });

    await expect(getStatePensionFromSession('abc')).resolves.toEqual({
      weeklyAmount: '180',
    });
  });

  it('returns an empty amount when the stored value is missing', async () => {
    mockedGet.mockResolvedValue({
      statePension: {} as ReturnType<typeof defaultStatePensionData>,
    });

    await expect(getStatePensionFromSession('abc')).resolves.toEqual(
      defaultStatePensionData(),
    );
  });

  it('returns null when state pension has not been saved', async () => {
    mockedGet.mockResolvedValue({});

    await expect(getStatePensionFromSession('abc')).resolves.toBeNull();
  });

  it('saves the weekly amount onto the journey session', async () => {
    const data = defaultStatePensionData();
    await saveStatePensionToSession('abc', data);

    expect(mockedUpdate).toHaveBeenCalledWith('abc', { statePension: data });
  });
});
