import { render } from '@testing-library/react';

import { mockStations } from '../../utils/FuelFinder/mocks';
import {
  mockedUseRouter,
  setupFakeTimers,
  setupUseRouter,
} from '../../utils/FuelFinder/testHelpers';
import FuelFinder from './FuelFinder';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// Mock date-fns `format` so the "Prices updated" timestamp is deterministic
// across CI hosts regardless of local timezone. `FuelFinder.tsx` is the only
// file in this app that pulls `format` from date-fns, and no shared library
// imports it, so this mock is safely scoped to this test file.
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(() => '4/6/2025 12:00'),
}));

const FETCHED_AT = '2025-06-04T12:00:00Z';

describe('FuelFinder', () => {
  setupFakeTimers();
  setupUseRouter();

  it('renders the pre-search view when hasSearched is false', () => {
    const { container } = render(
      <FuelFinder
        stations={[]}
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
      query: { language: 'en', postcode: 'SW1A 1AA' },
      asPath: '/en/fuel-finder?postcode=SW1A+1AA',
    });
    const { container } = render(
      <FuelFinder
        stations={mockStations}
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
        postcode: 'SW1A 1AA',
        fuelType: 'E10',
        supermarket: 'true',
      },
      asPath: '/en/fuel-finder?postcode=SW1A+1AA&fuelType=E10&supermarket=true',
    });
    const { container } = render(
      <FuelFinder
        stations={mockStations}
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
      query: { language: 'en', postcode: 'XX1 1XX' },
      asPath: '/en/fuel-finder?postcode=XX1+1XX',
    });
    const { container } = render(
      <FuelFinder
        stations={[]}
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
      query: { language: 'en', postcode: 'SW1A 1AA', p: '2' },
      asPath: '/en/fuel-finder?postcode=SW1A+1AA&p=2',
    });
    const { container } = render(
      <FuelFinder
        stations={mockStations}
        totalItems={10}
        fetchedAt={FETCHED_AT}
        hasSearched={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
