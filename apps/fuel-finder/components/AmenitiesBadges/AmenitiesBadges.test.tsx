import { render } from '@testing-library/react';

import AmenitiesBadges from './AmenitiesBadges';

describe('AmenitiesBadges', () => {
  it('renders the empty state when amenities array is empty', () => {
    const { container } = render(<AmenitiesBadges amenities={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a single known amenity using AMENITY_LABELS', () => {
    const { container } = render(<AmenitiesBadges amenities={['car_wash']} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders multiple known amenities', () => {
    const { container } = render(
      <AmenitiesBadges
        amenities={['car_wash', 'customer_toilets', 'adblue_pumps']}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders an unknown amenity using the title-cased fallback', () => {
    const { container } = render(
      <AmenitiesBadges amenities={['charging_point']} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a mix of known and unknown amenities', () => {
    const { container } = render(
      <AmenitiesBadges amenities={['car_wash', 'charging_point']} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
