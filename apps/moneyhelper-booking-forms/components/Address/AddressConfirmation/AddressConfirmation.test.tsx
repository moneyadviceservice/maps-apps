import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AddressConfirmation } from '.';
import { FormFieldName } from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AddressConfirmation Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });

    entry = {
      ...mockEntry,
      data: {
        ...mockEntry.data,
        [FormFieldName.ADDRESS_LINE_1]: '123 Main St',
        [FormFieldName.ADDRESS_LINE_2]: 'Apt 4B',
        [FormFieldName.CITY]: 'Anytown',
        [FormFieldName.COUNTY]: 'Anyshire',
        [FormFieldName.POSTCODE]: 'AN1 2BC',
        [FormFieldName.COUNTRY]: 'Anyland',
      },
    };
  });

  it('renders the component correctly', () => {
    const { container } = render(
      <AddressConfirmation step={mockSteps[0]} entry={entry} />,
    );

    // Check that the address is rendered correctly
    expect(container).toHaveTextContent('123 Main St');
    expect(container).toHaveTextContent('Apt 4B');
    expect(container).toHaveTextContent('Anytown');
    expect(container).toHaveTextContent('Anyshire');
    expect(container).toHaveTextContent('AN1 2BC');
    expect(container).toHaveTextContent('Anyland');

    // Check for link to AddressDetails step
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/en/address-details',
    );

    // Snapshot
    expect(container).toMatchSnapshot();
  });

  it('throws an error if entry is missing', () => {
    expect(() =>
      render(<AddressConfirmation step={mockSteps[0]} entry={undefined} />),
    ).toThrow('[AddressConfirmation] Missing entry');
  });
});
