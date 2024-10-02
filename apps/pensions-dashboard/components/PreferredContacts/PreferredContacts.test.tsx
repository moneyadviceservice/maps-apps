import React from 'react';
import { render } from '@testing-library/react';
import { PreferredContacts } from '.';
import { ContactMethod } from '../../lib/types';
import { UsageType } from '../../lib/constants';

const mockMethods: ContactMethod[] = [
  {
    preferred: true,
    contactMethodDetails: {
      number: '+44 800873431',
      usage: [UsageType.M],
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      number: '+44 800873432',
      usage: [UsageType.W],
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      number: '+44 800873433',
      usage: [UsageType.S],
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      number: '+44 800873434',
      usage: [UsageType.N],
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      number: '+44 800873435',
      usage: [UsageType.A],
    },
  },
  {
    preferred: false,
    contactMethodDetails: {
      number: '+44 NOTPREFERRED',
      usage: [UsageType.A],
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      email: 'preferred@email.com',
    },
  },
  {
    preferred: false,
    contactMethodDetails: {
      email: 'notpreferred@email.com',
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      url: 'https://preferredurl.co.uk',
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      postalName: 'Preferred address',
      line1: 'Line 1 Address',
      line2: 'Line 2 Address',
      line3: 'Line 3 Address',
      line4: 'Line 4 Address',
      line5: 'Line 5 Address',
      postcode: 'Postcode',
      countryCode: 'GB',
    },
  },
  {
    preferred: true,
    contactMethodDetails: {
      postalName: 'Preferred address - France',
      line1: 'Line 1 Address',
      line2: 'Line 2 Address',
      line3: 'Line 3 Address',
      postcode: 'Postcode',
      countryCode: 'FR',
    },
  },
  {
    preferred: false,
    contactMethodDetails: {
      postalName: 'Not preferred address',
      line1: 'Line 1 Address',
      line2: 'Line 2 Address',
      line3: 'Line 3 Address',
      postcode: 'Postcode',
      countryCode: 'GB',
    },
  },
];

const mockNoPreferredMethods: ContactMethod[] = [
  {
    preferred: false,
    contactMethodDetails: {
      number: '+44 800873431',
      usage: [UsageType.M],
    },
  },
  {
    preferred: false,
    contactMethodDetails: {
      postalName: 'Not preferred address',
      line1: 'Line 1 Address',
      line2: 'Line 2 Address',
      postcode: 'Postcode',
      countryCode: 'GB',
    },
  },
];

describe('Preferred Contacts', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PreferredContacts contactMethods={mockMethods} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders no preferred contacts correctly', () => {
    const { container } = render(
      <PreferredContacts contactMethods={mockNoPreferredMethods} />,
    );
    expect(container).toMatchSnapshot();
  });
});
