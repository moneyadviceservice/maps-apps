import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AddressLookup } from '.';
import {
  FlowName,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
} from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');

let entry: BookingEntry;

describe('AddressLookup Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockSections,
    });
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AddressLookup step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    const AddressLookupErrors = {
      [FormFieldName.LOOKUP_POSTCODE]: [FORM_FIELD_CONTENT_KEY.lookupPostcode],
      [FormFieldName.LOOKUP_ADDRESS_LINE_1]: [
        FORM_FIELD_CONTENT_KEY.lookupAddressLine1,
      ],
    };

    const { container } = render(
      <AddressLookup
        step={mockSteps[0]}
        entry={entry}
        errors={AddressLookupErrors}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
