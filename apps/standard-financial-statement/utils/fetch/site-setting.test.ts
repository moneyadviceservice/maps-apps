import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

import { fetchSiteSettings } from './site-settings';

jest.mock('@maps-react/utils/aemHeadlessClient');

describe('fetchSiteSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs error and returns undefined when runPersistedQuery throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /* intentional noop for test */
    });

    (aemHeadlessClient.runPersistedQuery as jest.Mock).mockRejectedValue(
      new Error('Network failure'),
    );

    const result = await fetchSiteSettings('en');

    expect(consoleSpy).toHaveBeenCalledWith(
      'failed to fetch site settings: ',
      expect.any(Error),
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
