import { render, screen } from '@testing-library/react';

import { mockMapStations, mockStations } from '../../utils/FuelFinder/mocks';
import {
  mockedUseRouter,
  setupFakeTimers,
  setupUseRouter,
} from '../../utils/FuelFinder/testHelpers';
import FuelFinder from './FuelFinder';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// The map needs Google's API; StationMap has its own tests
jest.mock('../StationMap', () => ({
  __esModule: true,
  default: () => <div data-testid="station-map" />,
}));

// Mock date-fns `format` so the "Prices updated" timestamp is deterministic
// across CI hosts regardless of local timezone. `FuelFinder.tsx` is the only
// file in this app that pulls `format` from date-fns, and no shared library
// imports it, so this mock is safely scoped to this test file.
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(() => '4/6/2025 12:00'),
}));

const FETCHED_AT = '2025-06-04T12:00:00Z';
const MAPS_KEY = 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY';
const ORIGINAL_MAPS_KEY = process.env[MAPS_KEY];

describe('FuelFinder', () => {
  setupFakeTimers();
  setupUseRouter();

  // Nx loads .env files into the test environment, so the key's presence must
  // not depend on the machine: snapshots cover the list-only page and the map
  // tests opt in explicitly.
  beforeEach(() => {
    delete process.env[MAPS_KEY];
  });

  afterAll(() => {
    if (ORIGINAL_MAPS_KEY !== undefined)
      process.env[MAPS_KEY] = ORIGINAL_MAPS_KEY;
  });

  it('renders the pre-search view when hasSearched is false', () => {
    const { container } = render(
      <FuelFinder
        stations={[]}
        mapStations={[]}
        totalItems={0}
        fetchedAt=""
        hasSearched={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the full results view with stations and no active filters', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', lat: '51.5', lng: '-0.12' },
      asPath: '/en/fuel-finder?lat=51.5&lng=-0.12',
    });
    const { container } = render(
      <FuelFinder
        stations={mockStations}
        mapStations={mockMapStations}
        totalItems={mockStations.length}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the results view with the ActiveFilters section visible', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: {
        language: 'en',
        lat: '51.5',
        lng: '-0.12',
        fuelType: 'E10',
        supermarket: 'true',
      },
      asPath:
        '/en/fuel-finder?lat=51.5&lng=-0.12&fuelType=E10&supermarket=true',
    });
    const { container } = render(
      <FuelFinder
        stations={mockStations}
        mapStations={mockMapStations}
        totalItems={mockStations.length}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the zero-results state when hasSearched is true but totalItems is 0', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', lat: '52.0', lng: '-1.0' },
      asPath: '/en/fuel-finder?lat=52.0&lng=-1.0',
    });
    const { container } = render(
      <FuelFinder
        stations={[]}
        mapStations={[]}
        totalItems={0}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders pagination state for page 2', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', lat: '51.5', lng: '-0.12', p: '2' },
      asPath: '/en/fuel-finder?lat=51.5&lng=-0.12&p=2',
    });
    const { container } = render(
      <FuelFinder
        stations={mockStations}
        mapStations={mockMapStations}
        totalItems={10}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the map beside the list once a maps key is configured', () => {
    process.env[MAPS_KEY] = 'test-key';
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
      query: { language: 'en', lat: '51.5', lng: '-0.12' },
      asPath: '/en/fuel-finder?lat=51.5&lng=-0.12',
      events: { on: jest.fn(), off: jest.fn() },
    });
    render(
      <FuelFinder
        stations={mockStations}
        mapStations={mockMapStations}
        totalItems={mockStations.length}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );

    const map = screen.getByTestId('station-map');
    expect(screen.getByTestId('station-list')).toBeInTheDocument();
    expect(map.closest('.grid')).toHaveClass('xl:grid-cols-2');
  });

  it('keeps the single-column list without a maps key', () => {
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
      query: { language: 'en', lat: '51.5', lng: '-0.12' },
      asPath: '/en/fuel-finder?lat=51.5&lng=-0.12',
      events: { on: jest.fn(), off: jest.fn() },
    });
    render(
      <FuelFinder
        stations={mockStations}
        mapStations={mockMapStations}
        totalItems={mockStations.length}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );

    expect(screen.queryByTestId('station-map')).not.toBeInTheDocument();
    expect(screen.getByTestId('station-list').closest('.grid')).not.toHaveClass(
      'xl:grid-cols-2',
    );
  });

  it('expands and focuses the card selected by the URL hash', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', lat: '51.5', lng: '-0.12' },
      asPath: '/en/fuel-finder?lat=51.5&lng=-0.12#station-station-002',
    });
    render(
      <FuelFinder
        stations={mockStations}
        mapStations={mockMapStations}
        totalItems={mockStations.length}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );

    const cards = screen.getAllByTestId('station-card');
    expect(cards[1]).toHaveAttribute('id', 'station-station-002');
    expect(cards[1].querySelector('details')).toHaveAttribute('open');
    expect(cards[0].querySelector('details')).not.toHaveAttribute('open');
    expect(document.activeElement).toBe(cards[1]);
  });
});
