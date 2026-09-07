import { render, screen } from '@testing-library/react';

import { mockStations } from '../../utils/FuelFinder/mocks';
import { setupFakeTimers } from '../../utils/FuelFinder/testHelpers';
import StationList from './StationList';

describe('StationList', () => {
  setupFakeTimers();

  it('renders an empty list when no stations', () => {
    const { container } = render(
      <StationList stations={[]} selectedFuelTypes={[]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a list of StationCards when stations are returned', () => {
    const { container } = render(
      <StationList stations={mockStations} selectedFuelTypes={[]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a list highlighting a single selected fuel type', () => {
    const { container } = render(
      <StationList stations={mockStations} selectedFuelTypes={['E10']} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders skeleton tiles instead of cards when isLoading is true', () => {
    render(
      <StationList
        stations={mockStations}
        selectedFuelTypes={[]}
        isLoading={true}
      />,
    );
    expect(screen.queryAllByTestId('station-card')).toHaveLength(0);
    expect(screen.getAllByTestId('station-card-skeleton')).toHaveLength(
      mockStations.length,
    );
  });

  it('uses skeletonCount when stations array is empty', () => {
    render(
      <StationList
        stations={[]}
        selectedFuelTypes={[]}
        isLoading={true}
        skeletonCount={4}
      />,
    );
    expect(screen.getAllByTestId('station-card-skeleton')).toHaveLength(4);
  });

  it('toggles aria-busy based on isLoading', () => {
    const { rerender } = render(
      <StationList stations={mockStations} selectedFuelTypes={[]} />,
    );
    expect(screen.getByTestId('station-list')).toHaveAttribute(
      'aria-busy',
      'false',
    );

    rerender(
      <StationList
        stations={mockStations}
        selectedFuelTypes={[]}
        isLoading={true}
      />,
    );
    expect(screen.getByTestId('station-list')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});
