import { loadModule } from 'tests/helper/redis/redisModuleLoader';
import { defaultAboutYouData } from 'types/aboutYou';

import {
  getAboutYouFromSession,
  saveAboutYouToSession,
} from './aboutYouSession';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn(),
  redisRestSet: jest.fn(),
}));

describe('aboutYouSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns about you from the journey session', async () => {
    const { mockedGet } = await loadModule();
    mockedGet.mockResolvedValue({
      success: true,
      data: {
        key: 'pension-calculator:abc',
        value: JSON.stringify({
          aboutYou: {
            day: '27',
            month: '03',
            year: '1960',
            sex: 'female',
            retireAge: '65',
          },
        }),
        site: 'test',
      },
    });

    const data = await getAboutYouFromSession('abc');
    expect(data?.day).toBe('27');
    expect(data?.sex).toBe('female');
  });

  it('returns null when about you is not stored', async () => {
    const { mockedGet } = await loadModule();
    mockedGet.mockResolvedValue({
      success: true,
      data: {
        key: 'pension-calculator:abc',
        value: JSON.stringify({}),
        site: 'test',
      },
    });
    expect(await getAboutYouFromSession('abc')).toBeNull();
  });

  it('saves about you into the journey session', async () => {
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

    await saveAboutYouToSession('abc', aboutYou);

    expect(mockedSet).toHaveBeenCalledWith(
      'pension-calculator:abc',
      JSON.stringify({ aboutYou }),
    );
  });
});
