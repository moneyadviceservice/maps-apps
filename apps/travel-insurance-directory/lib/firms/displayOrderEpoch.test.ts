import { generateSeed } from 'utils/shufflePACs';

import {
  getDisplayOrderEpoch,
  isDisplayOrderExpired,
  setDisplayOrderEpoch,
} from './displayOrderEpoch';

const mockRead = jest.fn();
const mockUpsert = jest.fn();
const mockItem = jest.fn().mockReturnValue({ read: mockRead });

jest.mock('../database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: { item: mockItem, items: { upsert: mockUpsert } },
    }),
}));

jest.mock('utils/shufflePACs', () => ({
  generateSeed: jest.fn(() => 12345),
}));

describe('displayOrderEpoch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockItem.mockReturnValue({ read: mockRead });
  });

  describe('getDisplayOrderEpoch', () => {
    it('returns seed_hour when document exists', async () => {
      mockRead.mockResolvedValue({ resource: { seed_hour: 999 } });
      await expect(getDisplayOrderEpoch()).resolves.toBe(999);
    });

    it('returns null when read throws', async () => {
      mockRead.mockRejectedValue(new Error('Not found'));
      await expect(getDisplayOrderEpoch()).resolves.toBeNull();
    });

    it('returns null when resource is empty', async () => {
      mockRead.mockResolvedValue({ resource: undefined });
      await expect(getDisplayOrderEpoch()).resolves.toBeNull();
    });
  });

  describe('setDisplayOrderEpoch', () => {
    it('upserts doc with id and seed_hour', async () => {
      mockUpsert.mockResolvedValue(undefined);
      await setDisplayOrderEpoch(42);
      expect(mockUpsert).toHaveBeenCalledWith({
        id: 'display_order_epoch',
        seed_hour: 42,
      });
    });
  });

  describe('isDisplayOrderExpired', () => {
    it('returns true when stored is null', async () => {
      mockRead.mockResolvedValue({ resource: undefined });
      await expect(isDisplayOrderExpired()).resolves.toBe(true);
    });

    it('returns true when stored seed differs from current', async () => {
      (generateSeed as jest.Mock).mockReturnValue(111);
      mockRead.mockResolvedValue({ resource: { seed_hour: 222 } });
      await expect(isDisplayOrderExpired()).resolves.toBe(true);
    });

    it('returns false when stored seed matches current', async () => {
      (generateSeed as jest.Mock).mockReturnValue(12345);
      mockRead.mockResolvedValue({ resource: { seed_hour: 12345 } });
      await expect(isDisplayOrderExpired()).resolves.toBe(false);
    });
  });
});
