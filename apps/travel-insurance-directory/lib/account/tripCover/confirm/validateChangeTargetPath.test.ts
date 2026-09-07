import { isAllowedChangeTargetPath } from './validateChangeTargetPath';

describe('validateChangeTargetPath', () => {
  const firmId = 'firm-123';

  it('allows regions path', () => {
    expect(
      isAllowedChangeTargetPath(firmId, '/account/trip-cover/regions/firm-123'),
    ).toBe(true);
  });

  it('allows age limits path', () => {
    expect(
      isAllowedChangeTargetPath(
        firmId,
        '/account/trip-cover/firm-123/uk_and_europe/single_trip',
      ),
    ).toBe(true);
  });

  it('allows service details path', () => {
    expect(
      isAllowedChangeTargetPath(
        firmId,
        '/account/trip-cover/service-details/firm-123',
      ),
    ).toBe(true);
  });

  it('rejects mismatched firm id', () => {
    expect(
      isAllowedChangeTargetPath(
        firmId,
        '/account/trip-cover/regions/other-firm',
      ),
    ).toBe(false);
  });

  it('rejects invalid paths', () => {
    expect(isAllowedChangeTargetPath(firmId, '/account')).toBe(false);
  });
});
