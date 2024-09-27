import React from 'react';
import { render } from '@testing-library/react';
import { Address } from '.';

const mockAddress = {
  postalName: 'The House',
  line1: 'Line 1',
  postcode: 'TN1 1AA',
  countryCode: 'GB',
};

const mockFullAddress = {
  ...mockAddress,
  line2: 'Line 2',
  line3: 'Line 3',
  line4: 'Line 4',
  line5: 'Line 5',
};

describe('Address', () => {
  it('renders minimal address correctly', () => {
    const { container } = render(<Address address={mockAddress} />);
    expect(container).toMatchSnapshot();
  });

  it('renders full address correctly', () => {
    const { container } = render(<Address address={mockFullAddress} />);
    expect(container).toMatchSnapshot();
  });
});
