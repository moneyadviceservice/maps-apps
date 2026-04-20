import { render } from '@testing-library/react';

import { mockStation } from '../../utils/FuelFinder/mocks';
import {
  createTestStation,
  setupFakeTimers,
} from '../../utils/FuelFinder/testHelpers';
import StationExpandedView from './StationExpandedView';

describe('StationExpandedView', () => {
  setupFakeTimers();

  it('renders the default expanded view with prices, hours and amenities', () => {
    const { container } = render(<StationExpandedView station={mockStation} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('hides the fuel prices table when fuel_prices is empty', () => {
    const { container } = render(
      <StationExpandedView station={createTestStation({ fuel_prices: [] })} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the amenities empty state when amenities is empty', () => {
    const { container } = render(
      <StationExpandedView station={createTestStation({ amenities: [] })} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
