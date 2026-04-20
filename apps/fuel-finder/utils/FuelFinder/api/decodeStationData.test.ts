import type { CompactData } from '../types';
import { decodeStationData } from './decodeStationData';

// Hand-crafted fixture — intentionally not reusing an encoder so the test can
// catch an encoder-decoder drift if one is introduced.
function buildFixture(): CompactData {
  const dayTuple = (
    open: string,
    close: string,
    is24: boolean,
  ): [string, string, boolean] => [open, close, is24];

  const normalWeek = [
    dayTuple('06:00:00', '22:00:00', false), // monday
    dayTuple('06:00:00', '22:00:00', false),
    dayTuple('06:00:00', '22:00:00', false),
    dayTuple('06:00:00', '22:00:00', false),
    dayTuple('06:00:00', '22:00:00', false),
    dayTuple('08:00:00', '20:00:00', false), // saturday
    dayTuple('08:00:00', '20:00:00', false), // sunday
  ];
  const allDay = [
    dayTuple('00:00:00', '00:00:00', true),
    dayTuple('00:00:00', '00:00:00', true),
    dayTuple('00:00:00', '00:00:00', true),
    dayTuple('00:00:00', '00:00:00', true),
    dayTuple('00:00:00', '00:00:00', true),
    dayTuple('00:00:00', '00:00:00', true),
    dayTuple('00:00:00', '00:00:00', true),
  ];

  return {
    v: 1,
    f: '2026-04-16T10:00:00',
    _b: ['Shell'],
    _ci: ['London', 'Manchester'],
    _cn: ['Greater London'],
    _co: ['England'],
    _ot: [
      [normalWeek, ['closed', '00:00:00', '00:00:00', false]],
      [allDay, null],
    ],
    s: [
      [
        '4882e3fee979', // node_id
        'Test Station Alpha', // trading_name
        0, // brand idx → Shell
        '+448003234040', // phone
        9, // flags: SAME_NAME (1) | MOTORWAY (8)
        '123 Main St', // addr1
        'Suite 5', // addr2
        0, // city idx → London
        0, // country idx → England
        0, // county idx → Greater London
        'SW1A 1AA', // postcode
        51.5014,
        -0.1419,
        3, // amenities: water_filling (1) | car_wash (2)
        0, // opening_times idx
        3, // fuel_types: E10 (1) | E5 (2)
        [
          [0, 145.9, '2026-04-15T10:00:00Z'], // E10
          [1, 150.9, '2026-04-15T10:00:00Z'], // E5
        ],
      ],
      [
        'abc123def456',
        'Unbranded Test',
        null, // brand null
        null, // phone null
        0, // no flags
        '789 Back Ln',
        null, // addr2 null
        1, // city idx → Manchester
        0, // country idx → England
        null, // county null
        'M1 1AA',
        53.48,
        -2.24,
        32, // amenities: lpg_pumps (bit 5)
        1, // opening_times idx (24h, no bank_holiday)
        32, // fuel_types: HVO (bit 5)
        [[5, 200, '2026-04-15T09:00:00Z']],
      ],
    ],
  };
}

describe('decodeStationData', () => {
  it('decodes a full station with brand, county, bank holiday, multiple prices', () => {
    const { stations, fetchedAt } = decodeStationData(buildFixture());

    expect(fetchedAt).toBe('2026-04-16T10:00:00');
    expect(stations).toHaveLength(2);

    const s = stations[0];
    expect(s.node_id).toBe('4882e3fee979');
    expect(s.trading_name).toBe('Test Station Alpha');
    expect(s.brand_name).toBe('Shell');
    expect(s.public_phone_number).toBe('+448003234040');
    expect(s.is_same_trading_and_brand_name).toBe(true);
    expect(s.is_motorway_service_station).toBe(true);
    expect(s.is_supermarket_service_station).toBe(false);
    expect(s.temporary_closure).toBe(false);
    expect(s.permanent_closure).toBe(false);
    expect(s.location).toEqual({
      address_line_1: '123 Main St',
      address_line_2: 'Suite 5',
      city: 'London',
      country: 'England',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
      latitude: 51.5014,
      longitude: -0.1419,
    });
    expect(s.amenities).toEqual(['water_filling', 'car_wash']);
    expect(s.fuel_types).toEqual(['E10', 'E5']);
    expect(s.fuel_prices).toEqual([
      {
        fuel_type: 'E10',
        price: 145.9,
        price_last_updated: '2026-04-15T10:00:00Z',
        price_change_effective_timestamp: '',
      },
      {
        fuel_type: 'E5',
        price: 150.9,
        price_last_updated: '2026-04-15T10:00:00Z',
        price_change_effective_timestamp: '',
      },
    ]);
    expect(s.opening_times.usual_days.monday).toEqual({
      open: '06:00:00',
      close: '22:00:00',
      is_24_hours: false,
    });
    expect(s.opening_times.bank_holiday).toEqual({
      type: 'closed',
      open_time: '00:00:00',
      close_time: '00:00:00',
      is_24_hours: false,
    });
  });

  it('decodes a station with null brand, null county, no bank holiday, 24h hours', () => {
    const { stations } = decodeStationData(buildFixture());
    const s = stations[1];

    expect(s.brand_name).toBeNull();
    expect(s.public_phone_number).toBeNull();
    expect(s.location.address_line_2).toBeNull();
    expect(s.location.county).toBeNull();
    expect(s.location.city).toBe('Manchester');
    expect(s.location.country).toBe('England');
    expect(s.amenities).toEqual(['lpg_pumps']);
    expect(s.fuel_types).toEqual(['HVO']);
    expect(s.fuel_prices).toEqual([
      {
        fuel_type: 'HVO',
        price: 200,
        price_last_updated: '2026-04-15T09:00:00Z',
        price_change_effective_timestamp: '',
      },
    ]);
    expect(s.opening_times.usual_days.monday).toEqual({
      open: '00:00:00',
      close: '00:00:00',
      is_24_hours: true,
    });
    expect(s.opening_times.bank_holiday).toBeUndefined();
  });

  it('reconstructs lossy fields as null / empty string', () => {
    const { stations } = decodeStationData(buildFixture());
    expect(stations[0].permanent_closure_date).toBeNull();
    expect(stations[1].permanent_closure_date).toBeNull();
    expect(stations[0].fuel_prices[0].price_change_effective_timestamp).toBe(
      '',
    );
  });

  it('throws on unsupported version', () => {
    const bad = { ...buildFixture(), v: 99 };
    expect(() => decodeStationData(bad)).toThrow(
      'Unsupported compact format version: 99',
    );
  });

  it('normalizes permanent_closure to boolean even when flag is unset', () => {
    const { stations } = decodeStationData(buildFixture());
    expect(stations[0].permanent_closure).toBe(false);
    expect(stations[1].permanent_closure).toBe(false);
  });

  it('decodes permanent_closure flag as true when set', () => {
    const fixture = buildFixture();
    // Set PERM_CLOSURE (bit 2 = 4) on second station
    const row = fixture.s[1] as unknown[];
    row[4] = 4;
    const { stations } = decodeStationData(fixture);
    expect(stations[1].permanent_closure).toBe(true);
  });
});
