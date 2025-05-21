import { render } from '@testing-library/react';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement, PhoneNumber } from '../../lib/types';
import { PensionDetailsContactTable } from './PensionDetailsContactTable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
}));

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailsContactTable', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PensionDetailsContactTable data={mockData} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('preferred contact methods', () => {
    const mockdataWithPhone = {
      ...mockData,
      pensionAdministrator: {
        ...mockData.pensionAdministrator,
        contactMethods: [
          {
            preferred: true,
            contactMethodDetails: {
              number: '+123 2222222222',
              usage: ['M'],
            } as PhoneNumber,
          },
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
        ],
      },
    };
    const { getByText } = render(
      <PensionDetailsContactTable data={mockdataWithPhone} />,
    );
    expect(
      getByText('common.contact.phone, common.contact.postal-address'),
    ).toBeInTheDocument();
  });

  it('no contact methods', () => {
    const mockdataWithPhone = {
      ...mockData,
      pensionAdministrator: {
        ...mockData.pensionAdministrator,
        contactMethods: [],
      },
    };
    const { getByTestId } = render(
      <PensionDetailsContactTable data={mockdataWithPhone} />,
    );
    expect(getByTestId('preferred-contact-methods')).toHaveTextContent('--');
    expect(getByTestId('contact-method-email')).toHaveTextContent('--');
    expect(getByTestId('contact-method-phone')).toHaveTextContent('--');
    expect(getByTestId('contact-method-address')).toHaveTextContent('--');
  });

  it.each`
    description                   | text
    ${'pension provider name'}    | ${'Pension Admin Highland'}
    ${'website contact method'}   | ${'https://www.highlandadmin.co.uk'}
    ${'preferred contact method'} | ${'common.contact.website, common.contact.email'}
    ${'email contact method'}     | ${/mastertrust@highlandadmin.com/}
    ${'telephone number'}         | ${'Main telephone: +44 800873434'}
  `('renders $description', ({ text }) => {
    const { queryAllByText } = render(
      <PensionDetailsContactTable data={mockData} />,
    );
    expect(queryAllByText(text).length).toBeGreaterThan(0);
  });

  it.each`
    description         | text
    ${'address line 1'} | ${'1 Travis Avenue'}
    ${'address line 2'} | ${'Main Street'}
    ${'address line 3'} | ${'Liverpool'}
    ${'postcode'}       | ${'M16 0QG'}
    ${'country'}        | ${'United Kingdom'}
  `('renders $description', ({ text }) => {
    const { getByText } = render(
      <PensionDetailsContactTable data={mockData} />,
    );
    expect(getByText(text)).toBeInTheDocument();
  });
});
