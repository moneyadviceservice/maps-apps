import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AddressDetails } from '.';
import { FlowName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

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
      addressLine1: ['address-line-1'],
      addressLine2: ['address-line-2'],
      city: ['city'],
      county: ['county'],
      postcode: ['postcode'],
      country: ['country'],
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
