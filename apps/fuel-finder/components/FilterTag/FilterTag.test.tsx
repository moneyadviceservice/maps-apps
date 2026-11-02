import { render } from '@testing-library/react';

import { setupUseRouter } from '../../utils/FuelFinder/testHelpers';
import FilterTag from './FilterTag';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('FilterTag', () => {
  setupUseRouter();

  it('renders with title, href and description', () => {
    const { container } = render(
      <FilterTag
        title="Diesel"
        href="/en/fuel-finder?fuelType=B7_STANDARD"
        description='Remove filter "Diesel"'
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a custom announcementText', () => {
    const { container } = render(
      <FilterTag
        title="Supermarket"
        href="/en/fuel-finder?supermarket=true"
        description='Remove filter "Supermarket"'
        announcementText="Supermarket filter removed"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
