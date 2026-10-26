import { extractPaginationParams } from '@maps-react/utils/pagination';

/**
 * Travel-insurance-directory uses defaultLimit 5. Shared pagination tests live in
 * libs/shared/utils/src/pagination/paginationUtils.test.ts
 */
describe('extractPaginationParams (TID defaultLimit)', () => {
  it('defaults to limit 5 when using defaultLimit option', () => {
    expect(extractPaginationParams({}, { defaultLimit: 5 })).toEqual({
      page: 1,
      limit: 5,
    });
  });
});
