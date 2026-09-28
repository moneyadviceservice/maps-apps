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

  it('renders the air_pump_or_screenwash amenity with its label', () => {
    const { getByText } = render(
      <AmenitiesBadges amenities={['air_pump_or_screenwash']} />,
    );
    expect(getByText('Air or screenwash')).toBeInTheDocument();
  });

  it('does not render a badge for twenty_four_hour_fuel', () => {
    const { getByText, queryByText } = render(
      <AmenitiesBadges amenities={['car_wash', 'twenty_four_hour_fuel']} />,
    );
    expect(getByText('Car Wash')).toBeInTheDocument();
    expect(queryByText('Twenty Four Hour Fuel')).not.toBeInTheDocument();
  });

  it('renders the empty state when only hidden amenities are present', () => {
    const { getByText } = render(
      <AmenitiesBadges amenities={['twenty_four_hour_fuel']} />,
    );
    expect(getByText('No services listed.')).toBeInTheDocument();
  });
});
