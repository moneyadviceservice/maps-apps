import {
  baseCompleteState,
  baseState,
  selfServeE2eConstants,
  tripCovers,
} from './selfServeE2eConstants';

describe('selfServeE2eConstants data', () => {
  it('exports valid selfServeE2eConstants', () => {
    expect(selfServeE2eConstants.fcaNumber).toBe(123_456);
    expect(selfServeE2eConstants.tradingNames).toHaveLength(3);
  });

  it('exports baseState with initial defaults', () => {
    expect(baseState.fca_number).toBe(123_456);
    expect(baseState.registered_name).toBe('e2e main firm');
    expect(baseState.trip_covers).toEqual([]);
    expect(baseState.service_details).toBeUndefined();
    expect(baseState.hidden_reason).toBeNull();
  });

  it('generates all 6 tripCovers permutations', () => {
    expect(tripCovers).toHaveLength(6);
    expect(tripCovers[0]).toEqual(
      expect.objectContaining({
        trip_type: 'single_trip',
        cover_area: 'uk_and_europe',
      }),
    );
  });

  it('exports baseCompleteState containing complete office and service details', () => {
    expect(baseCompleteState.office?.address.town).toBe('Bedford');
    expect(baseCompleteState.service_details?.medical_screening_company).toBe(
      'verisk',
    );
    expect(baseCompleteState.trip_covers).toHaveLength(6);
  });
});
