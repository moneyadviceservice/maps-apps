import { isListedOnPublicDirectory } from 'lib/firms/fcaVisibility';
import { invalidateFirmsListingCache } from 'lib/firms/invalidateFirmsListingCache';

import { resyncPublicListingIfApproved } from './resyncPublicListingIfApproved';

jest.mock('lib/firms/fcaVisibility', () => ({
  isListedOnPublicDirectory: jest.fn(),
}));

jest.mock('lib/firms/invalidateFirmsListingCache', () => ({
  invalidateFirmsListingCache: jest.fn(),
}));

const mockIsListedOnPublicDirectory =
  isListedOnPublicDirectory as jest.MockedFunction<
    typeof isListedOnPublicDirectory
  >;
const mockInvalidateFirmsListingCache =
  invalidateFirmsListingCache as jest.MockedFunction<
    typeof invalidateFirmsListingCache
  >;

describe('resyncPublicListingIfApproved', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInvalidateFirmsListingCache.mockResolvedValue(undefined);
  });

  it('does not invalidate the listing cache when the firm is not on the directory', async () => {
    mockIsListedOnPublicDirectory.mockReturnValue(false);

    await resyncPublicListingIfApproved({
      status: 'hidden',
      hidden_reason: null,
    });

    expect(mockInvalidateFirmsListingCache).not.toHaveBeenCalled();
  });

  it('invalidates the listing cache when the firm is already listed', async () => {
    mockIsListedOnPublicDirectory.mockReturnValue(true);

    await resyncPublicListingIfApproved({
      status: 'active',
      hidden_reason: null,
    });

    expect(mockInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
  });
});
