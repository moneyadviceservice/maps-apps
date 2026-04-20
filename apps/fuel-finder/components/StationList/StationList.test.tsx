import { render } from '@testing-library/react';

import { mockStations } from '../../utils/FuelFinder/mocks';
import { setupFakeTimers } from '../../utils/FuelFinder/testHelpers';
import StationList from './StationList';

describe('StationList', () => {
  setupFakeTimers();

  it('renders the pre-search prompt when hasSearched is false', () => {
    const { container } = render(
      <StationList
        stations={[]}
        totalItems={0}
        hasSearched={false}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the no-results state when hasSearched is true and totalItems is 0', () => {
    const { container } = render(
      <StationList
        stations={[]}
        totalItems={0}
        hasSearched={true}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the no-results state with filter message when hasActiveFilters is true', () => {
    const { container } = render(
      <StationList
        stations={[]}
        totalItems={0}
        hasSearched={true}
        selectedFuelTypes={[]}
        hasActiveFilters={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a list of StationCards when stations are returned', () => {
    const { container } = render(
      <StationList
        stations={mockStations}
        totalItems={mockStations.length}
        hasSearched={true}
        selectedFuelTypes={[]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a list highlighting a single selected fuel type', () => {
    const { container } = render(
      <StationList
        stations={mockStations}
        totalItems={mockStations.length}
        hasSearched={true}
        selectedFuelTypes={['E10']}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
