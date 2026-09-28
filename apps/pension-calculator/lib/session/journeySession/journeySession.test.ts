import { loadModule } from 'tests/helper/redis/redisModuleLoader';
import { defaultAboutYouData } from 'types/aboutYou';

import {
  getJourneySession,
  saveJourneySession,
  updateJourneySession,
} from './journeySession';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn(),
  redisRestSet: jest.fn(),
}));

describe('journeySession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns parsed journey data from redis', async () => {
    const { mockedGet } = await loadModule();
    const aboutYou = defaultAboutYouData();
    mockedGet.mockResolvedValue({
      success: true,
      data: {
        key: 'pension-calculator:abc',
        value: JSON.stringify({ aboutYou }),
        site: 'test',
      },
    });

    expect(await getJourneySession('abc')).toEqual({ aboutYou });
    expect(mockedGet).toHaveBeenCalledWith('pension-calculator:abc');
  });

  it('returns empty object when redis is empty or fails', async () => {
    const { mockedGet } = await loadModule();
    mockedGet.mockResolvedValue({
      success: true,
      data: { key: 'pension-calculator:abc', value: null, site: 'test' },
    });
    expect(await getJourneySession('abc')).toEqual({});

    mockedGet.mockResolvedValue({
      success: false,
      error: 'down',
    });
    expect(await getJourneySession('abc')).toEqual({});

    mockedGet.mockRejectedValue(new Error('down'));
    expect(await getJourneySession('abc')).toEqual({});
  });

  it('saves journey data to redis', async () => {
    const { mockedSet } = await loadModule();

    mockedSet.mockResolvedValue({
      success: true,
      data: { success: true, site: 'test' },
    });
    const data = { aboutYou: defaultAboutYouData() };

    await saveJourneySession('abc', data);

    expect(mockedSet).toHaveBeenCalledWith(
      'pension-calculator:abc',
      JSON.stringify(data),
    );
  });

  it('rethrows when saving to redis fails', async () => {
    const { mockedSet } = await loadModule();

    mockedSet.mockResolvedValue({
      success: false,
      error: 'down',
    });
    await expect(saveJourneySession('abc', {})).rejects.toThrow('down');

    mockedSet.mockRejectedValue(new Error('network'));
    await expect(saveJourneySession('abc', {})).rejects.toThrow('network');
  });

  it('merges a patch into the existing journey session', async () => {
    const { mockedGet, mockedSet } = await loadModule();

    mockedGet.mockResolvedValue({
      success: true,
      data: {
        key: 'pension-calculator:abc',
        value: JSON.stringify({}),
        site: 'test',
      },
    });
    mockedSet.mockResolvedValue({
      success: true,
      data: { success: true, site: 'test' },
    });
    const aboutYou = defaultAboutYouData();

    const next = await updateJourneySession('abc', { aboutYou });

    expect(next).toEqual({ aboutYou });
    expect(mockedSet).toHaveBeenCalledWith(
      'pension-calculator:abc',
      JSON.stringify({ aboutYou }),
    );
  });
});
