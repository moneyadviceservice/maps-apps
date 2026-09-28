import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { ContactDetails } from '.';
import { FlowName, FormFieldName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');

let entry: BookingEntry;

describe('ContactDetails Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => [key],
      z: (value: { en: string; cy: string }) => value.en,
    });
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <ContactDetails step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    const contactDetailsErrors = {
      [FormFieldName.FIRST_NAME]: ['first-name'],
      [FormFieldName.LAST_NAME]: ['last-name'],
      [FormFieldName.EMAIL_ADDRESS]: ['email-address'],
      [FormFieldName.PHONE_NUMBER]: ['phone-number'],
      [FormFieldName.DATE_OF_BIRTH]: ['date-of-birth'],
      [FormFieldName.MEMORABLE_WORD]: ['memorable-word'],
    };

    const { container } = render(
      <ContactDetails
        step={mockSteps[0]}
        entry={entry}
        errors={contactDetailsErrors}
      />,
    );

    expect(container).toMatchSnapshot();
  });
  it('renders next step as confirm-details when edit mode is true', () => {
    const { container } = render(
      <ContactDetails
        step={mockSteps[0]}
        entry={{ ...entry, editMode: true }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
