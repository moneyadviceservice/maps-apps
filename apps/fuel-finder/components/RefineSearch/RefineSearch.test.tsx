import { render } from '@testing-library/react';

import {
  mockedUseRouter,
  setupUseRouter,
} from '../../utils/FuelFinder/testHelpers';
import RefineSearch from './RefineSearch';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('RefineSearch', () => {
  setupUseRouter();

  it('renders the default refine search form', () => {
    const { container } = render(<RefineSearch />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a pre-populated postcode from the router query', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', postcode: 'SW1A 1AA' },
      asPath: '/en/fuel-finder?postcode=SW1A+1AA',
    });
    const { container } = render(<RefineSearch />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with all amenity checkboxes pre-selected from the router query', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: {
        language: 'en',
        motorway: 'true',
        supermarket: 'true',
        open24h: 'true',
        toilets: 'true',
      },
      asPath:
        '/en/fuel-finder?motorway=true&supermarket=true&open24h=true&toilets=true',
    });
    const { container } = render(<RefineSearch />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a pre-selected fuel type and radius from the router query', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', fuelType: 'E10', radius: '25' },
      asPath: '/en/fuel-finder?fuelType=E10&radius=25',
    });
    const { container } = render(<RefineSearch />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
