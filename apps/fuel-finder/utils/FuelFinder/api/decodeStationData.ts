import type {
  CompactData,
  CompactOpeningTimes,
  CompactStation,
  DayHours,
  FuelPrice,
  OpeningTimes,
  Station,
  StationsData,
} from '../types';
import {
  COMPACT_AMENITIES,
  COMPACT_FUEL_TYPES,
  COMPACT_VERSION,
  DAYS,
  FLAG_MOTORWAY,
  FLAG_PERM_CLOSURE,
  FLAG_SAME_NAME,
  FLAG_SUPERMARKET,
  FLAG_TEMP_CLOSURE,
  S,
} from './compact-format';

// permanent_closure_date and price_change_effective_timestamp are dropped by the
// encoder and reconstructed as null and '' — callers must not depend on them.

function decodeOpeningTimes(openingTimes: CompactOpeningTimes): OpeningTimes {
  const [days, bankHoliday] = openingTimes;

  const usual_days: Record<string, DayHours> = {};
  for (let i = 0; i < DAYS.length; i++) {
    const [open, close, is24] = days[i];
    usual_days[DAYS[i]] = {
      open: open ?? '00:00:00',
      close: close ?? '00:00:00',
      is_24_hours: is24,
    };
  }

  const result: OpeningTimes = { usual_days };
  if (bankHoliday) {
    const [type, openTime, closeTime, is24] = bankHoliday;
    result.bank_holiday = {
      type,
      open_time: openTime,
      close_time: closeTime,
      is_24_hours: is24,
    };
  }

  return result;
}

function decodeBitmask<T>(mask: number, values: readonly T[]): T[] {
  const result: T[] = [];
  for (let i = 0; i < values.length; i++) {
    if (mask & (1 << i)) result.push(values[i]);
  }
  return result;
}

function lookup<T>(
  idx: number | null,
  table: readonly string[],
  fallback: T,
): string | T {
  return idx == null ? fallback : table[idx];
}

function decodeStation(
  row: CompactStation,
  compact: CompactData,
  decodedOpeningTimes: readonly OpeningTimes[],
): Station {
  const flags = row[S.FLAGS];
  const prices: FuelPrice[] = row[S.FUEL_PRICES].map(
    ([typeIdx, price, lastUpdated]) => ({
      fuel_type: COMPACT_FUEL_TYPES[typeIdx],
      price,
      price_last_updated: lastUpdated,
      price_change_effective_timestamp: '',
    }),
  );

  return {
    node_id: row[S.NODE_ID],
    trading_name: row[S.TRADING_NAME],
    brand_name: lookup(row[S.BRAND], compact._b, null),
    public_phone_number: row[S.PHONE],
    is_same_trading_and_brand_name: !!(flags & FLAG_SAME_NAME),
    temporary_closure: !!(flags & FLAG_TEMP_CLOSURE),
    permanent_closure: !!(flags & FLAG_PERM_CLOSURE),
    permanent_closure_date: null,
    is_motorway_service_station: !!(flags & FLAG_MOTORWAY),
    is_supermarket_service_station: !!(flags & FLAG_SUPERMARKET),
    location: {
      address_line_1: row[S.ADDR1],
      address_line_2: row[S.ADDR2],
      city: lookup(row[S.CITY], compact._ci, ''),
      country: lookup(row[S.COUNTRY], compact._co, ''),
      county: lookup(row[S.COUNTY], compact._cn, null),
      postcode: row[S.POSTCODE],
      latitude: row[S.LAT],
      longitude: row[S.LNG],
    },
    amenities: decodeBitmask(row[S.AMENITIES], COMPACT_AMENITIES),
    opening_times: decodedOpeningTimes[row[S.OPENING_TIMES]],
    fuel_types: decodeBitmask(row[S.FUEL_TYPES], COMPACT_FUEL_TYPES),
    fuel_prices: prices,
  };
}

export function decodeStationData(compact: CompactData): StationsData {
  if (compact.v !== COMPACT_VERSION) {
    throw new Error(`Unsupported compact format version: ${compact.v}`);
  }

  const decodedOpeningTimes = compact._ot.map(decodeOpeningTimes);
  const stations = compact.s.map((row) =>
    decodeStation(row, compact, decodedOpeningTimes),
  );

  return { fetchedAt: compact.f, stations };
}
