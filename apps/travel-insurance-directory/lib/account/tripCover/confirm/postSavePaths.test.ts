import {
  resolveChangeAnswerPostSavePath,
  resolveTripCoverPostSavePath,
} from './postSavePaths';

describe('postSavePaths', () => {
  it('resolveChangeAnswerPostSavePath returns confirm path when editing from summary', () => {
    expect(resolveChangeAnswerPostSavePath('firm-123')).toBe(
      '/account/trip-cover/confirm/firm-123',
    );
  });

  it('resolveTripCoverPostSavePath returns default path during normal flow', () => {
    expect(
      resolveTripCoverPostSavePath(
        { query: {}, body: {} } as never,
        'firm-123',
        '/account/trip-cover/service-details/firm-123',
      ),
    ).toBe('/account/trip-cover/service-details/firm-123');
  });

  it('resolveTripCoverPostSavePath returns confirm path when isChangeAnswer is set', () => {
    expect(
      resolveTripCoverPostSavePath(
        { query: { isChangeAnswer: 'true' }, body: {} } as never,
        'firm-123',
        '/account/trip-cover/service-details/firm-123',
      ),
    ).toBe('/account/trip-cover/confirm/firm-123');
  });
});
