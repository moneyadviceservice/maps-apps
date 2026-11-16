import { render } from '@testing-library/react';

import { SubmissionState } from '@maps-react/mhf/constants';
import { mockEntry, mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AppointmentFound } from '.';
import { StepName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import { describeEachLanguage } from '../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils/getFieldError');

const entryWithAppointment: BookingEntry = {
  ...mockEntry,
  meta: {
    submissionState: SubmissionState.SUCCEEDED,
    responseData: {
      appointment: {
        appointmentId: 'APT-000000008',
        startDateTime: '2026-11-30T11:10:00+00:00',
        appointmentType: 'pw',
        appointmentLanguage: 'en',
        medium: 'phone',
        isDoubleSlot: false,
        isBslRequired: false,
        isInterpreterRequired: true,
      },
    },
  },
};

const entryWithStoredAppointment: BookingEntry = {
  ...mockEntry,
  data: {
    ...mockEntry.data,
    appointmentId: 'APT-000000009',
    startDateTime: '2026-12-01T11:10:00+00:00',
    appointmentType: 'pw',
    appointmentLanguage: 'en',
    medium: 'phone',
    isDoubleSlot: 'false',
    isBslRequired: 'false',
    isInterpreterRequired: 'true',
  },
};

describeEachLanguage('AppointmentFound', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AppointmentFound
        step={StepName.APPOINTMENT_FOUND}
        entry={entryWithAppointment}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders error state correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AppointmentFound
        errors={mockErrors}
        step={StepName.APPOINTMENT_FOUND}
        entry={entryWithAppointment}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with stored appointment', () => {
    const { container } = render(
      <AppointmentFound
        step={StepName.APPOINTMENT_FOUND}
        entry={entryWithStoredAppointment}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
