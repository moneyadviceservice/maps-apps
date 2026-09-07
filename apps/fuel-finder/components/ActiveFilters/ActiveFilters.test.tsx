import { render } from '@testing-library/react';

import {
  mockedUseRouter,
  setupUseRouter,
} from '../../utils/FuelFinder/testHelpers';
import ActiveFilters from './ActiveFilters';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('ActiveFilters', () => {
  setupUseRouter();

  it('renders zero active filters with an empty query', () => {
    const { container } = render(<ActiveFilters />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('does not render a tag for fuel type', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', fuelType: 'E10' },
      asPath: '/en/fuel-finder?fuelType=E10',
    });
    const { container } = render(<ActiveFilters />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders multiple station-type tags', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: {
        language: 'en',
        supermarket: 'true',
        motorway: 'true',
        open24h: 'true',
      },
      asPath: '/en/fuel-finder?supermarket=true&motorway=true&open24h=true',
    });
    const { container } = render(<ActiveFilters />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders only amenity tags when fuel type and amenities are set', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: {
        language: 'en',
        fuelType: 'B7_STANDARD',
        supermarket: 'true',
        toilets: 'true',
      },
      asPath:
        '/en/fuel-finder?fuelType=B7_STANDARD&supermarket=true&toilets=true',
    });
    const { container } = render(<ActiveFilters />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
