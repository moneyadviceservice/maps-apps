import { render } from '@testing-library/react';

import { setupUseRouter } from '../../utils/FuelFinder/testHelpers';
import StationsInformation from './StationsInformation';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('date-fns', () => ({
  format: () => '11/4/2026 09:30',
}));

describe('StationsInformation', () => {
  setupUseRouter();

  it('renders heading, change location link and last updated timestamp', () => {
    const { container } = render(
      <StationsInformation
        totalItems={12}
        fetchedAt="2026-04-11T09:30:00.000Z"
        fuelTypeLabel="Unleaded (E10)"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders singular heading when totalItems is 1', () => {
    const { container } = render(
      <StationsInformation
        totalItems={1}
        fetchedAt="2026-04-11T09:30:00.000Z"
        fuelTypeLabel="Diesel"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('omits the last updated timestamp when fetchedAt is empty', () => {
    const { container } = render(
      <StationsInformation totalItems={0} fetchedAt="" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
