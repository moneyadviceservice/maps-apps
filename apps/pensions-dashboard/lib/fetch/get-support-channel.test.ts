import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

import faqs from '../../components/SupportFaqList/SupportFaqList.mock.json';
import { getSupportChannel } from './get-support-channel';

jest.mock('@maps-react/utils/aemHeadlessClient');

describe('getSupportChannel', () => {
  it('should return the support channel', async () => {
    const mockData = {
      data: {
        supportChannelList: { items: [{ id: '1', faqs }] },
      },
    };
    (aemHeadlessClient.runPersistedQuery as jest.Mock).mockResolvedValue(
      mockData,
    );

    const result = await getSupportChannel('1');
    expect(result).toEqual({ id: '1', faqs });
  });

  it('should handle errors', async () => {
    (aemHeadlessClient.runPersistedQuery as jest.Mock).mockRejectedValue(
      new Error('Error fetching support channel'),
    );

    const result = await getSupportChannel('1');
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'failed to get support channel faqs:',
      expect.any(Error),
    );
  });
});
