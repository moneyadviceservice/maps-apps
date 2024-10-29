import React from 'react';
import { render } from '@testing-library/react';
import { PreferredContacts } from '.';
import { ContactMethod } from '../../lib/types';
import { mockPensionsData } from '../../lib/mocks';

const emailPrefered = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[0]
    .pensionAdministrator.contactMethods[1],
] as ContactMethod[];

const numberPrefered = [
  {
    preferred: true,
    contactMethodDetails: {
      number: '+44 800873434',
      usage: ['M'],
    },
  },
] as ContactMethod[];

const addressPrefered = [
  {
    preferred: true,
    contactMethodDetails: {
      postalName: 'Pension Admin Highland',
      line1: '1 Travis Avenue',
      line2: 'Main Street',
      line3: 'Liverpool',
      postcode: 'M16 0QG',
      countryCode: 'GB',
    },
  },
] as ContactMethod[];

const websitePrefered = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[0]
    .pensionAdministrator.contactMethods[0],
] as ContactMethod[];

const mockNoPreferredMethods: ContactMethod[] = [
  mockPensionsData.pensionPolicies[0].pensionArrangements[1]
    .pensionAdministrator.contactMethods[0],
] as ContactMethod[];

describe('Preferred Contacts', () => {
  it('renders correctly when email is preferred', () => {
    const { container } = render(
      <PreferredContacts contactMethods={emailPrefered} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when phone number is preferred', () => {
    const { container } = render(
      <PreferredContacts contactMethods={numberPrefered} />,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders correctly when address is preferred', () => {
    const { container } = render(
      <PreferredContacts contactMethods={addressPrefered} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when website is preferred', () => {
    const { container } = render(
      <PreferredContacts contactMethods={websitePrefered} />,
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
