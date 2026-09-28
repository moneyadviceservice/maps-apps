/**
 * Labels used to describe available station services.
 *
 * These are displayed in the UI and mapped from service flags.
 *
 * @readonly
 * @enum {string}
 */
export const STATION_SERVICE_LABELS = {
  /** Stations that are open 24 hours a day */
  open24h: 'Open 24 hours',

  /** Stations located on motorways */
  motorway: 'Motorway stations',

  /** Stations associated with supermarkets */
  supermarket: 'Supermarket stations',

  /** Stations that provide toilet facilities */
  toilets: 'Toilets',

  /** Stations that provide air pump or screenwash facilities */
  airScreenwash: 'Air or screenwash',
} as const;

/**
 * Represents a combination of filters applied when searching for fuel stations.
 *
 * @typedef {Object} FilterCombination
 * @property {string} distance - Search radius in miles (e.g. "5", "10", "25", "50")
 * @property {string} fuel - Fuel type selected by the user
 * @property {Object} services - Optional station service filters
 * @property {boolean} [services.open24h] - Include only 24-hour stations
 * @property {boolean} [services.motorway] - Include only motorway stations
 * @property {boolean} [services.supermarket] - Include supermarket stations
 * @property {boolean} [services.toilets] - Include stations with toilets
 * @property {boolean} [services.airScreenwash] - Include stations with air pump or screenwash facilities
 */

/**
 * Predefined filter combinations used for testing different search scenarios.
 *
 * These cover a variety of:
 * - Distances
 * - Fuel types
 * - Service filter combinations
 *
 * @type {readonly FilterCombination[]}
 */
export const filterCombinations = [
  {
    distance: '5',
    fuel: 'Unleaded (E10)',
    services: {
      open24h: true,
    },
  },
  {
    distance: '10',
    fuel: 'Super unleaded (E5)',
    services: {
      motorway: true,
    },
  },
  {
    distance: '25',
    fuel: 'Diesel',
    services: {
      supermarket: true,
    },
  },
  {
    distance: '50',
    fuel: 'Premium diesel',
    services: {
      open24h: true,
      toilets: true,
      airScreenwash: true,
    },
  },
] as const;
