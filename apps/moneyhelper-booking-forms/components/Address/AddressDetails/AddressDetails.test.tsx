import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AddressDetails } from '.';
import {
  FlowName,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
} from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');

let entry: BookingEntry;

describe('AddressDetails Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AddressDetails step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    const AddressDetailsErrors = {
      [FormFieldName.ADDRESS_LINE_1]: [FORM_FIELD_CONTENT_KEY.addressLine1],
      [FormFieldName.ADDRESS_LINE_2]: [FORM_FIELD_CONTENT_KEY.addressLine2],
      [FormFieldName.CITY]: [FORM_FIELD_CONTENT_KEY.city],
      [FormFieldName.COUNTY]: [FORM_FIELD_CONTENT_KEY.county],
      [FormFieldName.POSTCODE]: [FORM_FIELD_CONTENT_KEY.postcode],
      [FormFieldName.COUNTRY]: [FORM_FIELD_CONTENT_KEY.country],
    };

    const { container } = render(
      <AddressDetails
        step={mockSteps[0]}
        entry={entry}
        errors={AddressDetailsErrors}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
