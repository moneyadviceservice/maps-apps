import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { ContactDetails } from '.';
import { FlowName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');

let entry: BookingEntry;

describe('ContactDetails Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
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
      firstName: ['first-name'],
      lastName: ['last-name'],
      emailAddress: ['email-address'],
      phoneNumber: ['phone-number'],
      dateOfBirth: ['date-of-birth'],
      memorableWord: ['memorable-word'],
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
