import { render } from '@testing-library/react';

import { mockStation } from '../../utils/FuelFinder/mocks';
import {
  createTestStation,
  setupFakeTimers,
} from '../../utils/FuelFinder/testHelpers';
import StationCard from './StationCard';

describe('StationCard', () => {
  setupFakeTimers();

  // jsdom does not implement scrollIntoView; jest.setup.ts stubs it
  const scrollIntoView = jest.mocked(Element.prototype.scrollIntoView);
  beforeEach(() => {
    scrollIntoView.mockClear();
  });

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

  it('anchors the card by station id as a focus target for the map', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} />,
    );
    const card = container.querySelector('#station-test-node-001');
    expect(card).toHaveAttribute('data-testid', 'station-card');
    expect(card).toHaveAttribute('tabindex', '-1');
  });

  it('keeps the plain border and collapsed details when not selected', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} />,
    );
    expect(container.firstChild).not.toHaveClass('border-blue-700');
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('highlights the card and expands its details when selected', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} isSelected />,
    );
    expect(container.firstChild).toHaveClass('border-2', 'border-blue-700');
    expect(container.firstChild).not.toHaveClass('border-slate-400');
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('focuses and scrolls itself into view when it mounts selected', () => {
    const { container } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} isSelected />,
    );

    expect(document.activeElement).toBe(
      container.querySelector('#station-test-node-001'),
    );
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });

  it('reveals itself only once it becomes selected', () => {
    const { container, rerender } = render(
      <StationCard station={mockStation} selectedFuelTypes={[]} />,
    );
    const card = container.querySelector('#station-test-node-001');
    expect(document.activeElement).not.toBe(card);
    expect(scrollIntoView).not.toHaveBeenCalled();

    rerender(
      <StationCard station={mockStation} selectedFuelTypes={[]} isSelected />,
    );

    expect(document.activeElement).toBe(card);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });
});
