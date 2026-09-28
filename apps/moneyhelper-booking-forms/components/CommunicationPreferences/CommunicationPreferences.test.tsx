import { render } from '@testing-library/react';

import {
  mockEntry,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { CommunicationPreferences } from '.';
import { FormFieldName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');

let entry: BookingEntry;

describe('CommunicationPreferences Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) =>
        key.includes('communication-method.items')
          ? [{ value: 'mock-value|preferred-method', label: 'mock-text' }]
          : mockRadioOptions,
    });
    entry = {
      ...mockEntry,
      data: { flow: 'mock' },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <CommunicationPreferences step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    const communicationPreferenceErrors = {
      [FormFieldName.COMMUNICATION_METHOD]: [
        'Select at least one preferred method',
      ],
      [FormFieldName.COMMUNICATION_LARGE_PRINT]: [
        'Select whether you would like large print',
      ],
      [FormFieldName.COMMUNICATION_CONTACT_YOU]: [
        'Select whether you would like to be contacted',
      ],
    };
    const { container } = render(
      <CommunicationPreferences
        step={mockSteps[0]}
        entry={entry}
        errors={communicationPreferenceErrors}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders selected preferred methods when entry data has a checkbox value', () => {
    entry.data[FormFieldName.COMMUNICATION_METHOD] = 'mock-value';

    const { getByRole } = render(
      <CommunicationPreferences step={mockSteps[0]} entry={entry} />,
    );

    expect(getByRole('checkbox', { name: 'mock-text' })).toBeChecked();
  });

  it('falls back to the raw value when no encoded option match is found', () => {
    entry.data[FormFieldName.COMMUNICATION_METHOD] = 'unmatched-value';

    const { getByRole } = render(
      <CommunicationPreferences step={mockSteps[0]} entry={entry} />,
    );

    expect(getByRole('checkbox', { name: 'mock-text' })).not.toBeChecked();
  });
});
