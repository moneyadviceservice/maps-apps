import { render } from '@testing-library/react';

import { mockStation } from '../../utils/FuelFinder/mocks';
import {
  createTestStation,
  setupFakeTimers,
} from '../../utils/FuelFinder/testHelpers';
import StationCard from './StationCard';

describe('StationCard', () => {
  setupFakeTimers();

  it('renders the default station with no fuel-type filter applied', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the cheapest E10 price when E10 is the only selected fuel type', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={['E10']} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the supermarket badge', () => {
    const { container } = render(
      <StationCard
        station={createTestStation({ is_supermarket_service_station: true })}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the motorway badge', () => {
    const { container } = render(
      <StationCard
        station={createTestStation({ is_motorway_service_station: true })}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders both supermarket and motorway badges when both flags are set', () => {
    const { container } = render(
      <StationCard
        station={createTestStation({
          is_supermarket_service_station: true,
          is_motorway_service_station: true,
        })}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('hides the brand name line when is_same_trading_and_brand_name is true', () => {
    const { container } = render(
      <StationCard
        station={createTestStation({
          trading_name: 'BP',
          brand_name: 'BP',
          is_same_trading_and_brand_name: true,
        })}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('omits the distance row when distance is undefined', () => {
    const { container } = render(
      <StationCard
        station={createTestStation({ distance: undefined })}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('omits the cheapest-price row when fuel_prices is empty', () => {
    const { container } = render(
      <StationCard
        station={createTestStation({ fuel_prices: [] })}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders Google Maps link in the card body', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} />,
    );
    const link = container.querySelector('a[href*="google.com/maps"]');
    expect(link).not.toBeNull();
    expect(link?.textContent).toContain('View on Google Maps');
  });
});
