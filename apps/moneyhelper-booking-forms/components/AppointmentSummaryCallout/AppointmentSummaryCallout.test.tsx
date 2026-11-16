import { render } from '@testing-library/react';

import { mockEntry } from '@maps-react/mhf/mocks';

import { StepName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import { describeEachLanguage } from '../../test';
import { AppointmentSummaryCallout } from './AppointmentSummaryCallout';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

const entry: BookingEntry = {
  ...mockEntry,
  data: {
    ...mockEntry.data,
    appointmentId: 'APT-000000008',
    startDateTime: '2026-11-30T11:10:00+00:00',
    appointmentType: 'pw',
    appointmentLanguage: 'en',
    medium: 'phone',
    isDoubleSlot: 'false',
    isBslRequired: 'false',
    isInterpreterRequired: 'true',
  },
};

describeEachLanguage('AppointmentSummaryCallout', (locale) => {
  describe('Appointment Found', () => {
    it('renders null when no data is provided', () => {
      const { container } = render(
        <AppointmentSummaryCallout
          stepName={StepName.APPOINTMENT_FOUND}
          entry={undefined}
        />,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders the callout for the appointment-found step', () => {
      const { container } = render(
        <AppointmentSummaryCallout
          stepName={StepName.APPOINTMENT_FOUND}
          entry={entry}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a format-value of Video call when the medium is video', () => {
      const videoData: BookingEntry = {
        ...entry,
        data: { ...entry.data, medium: 'video' },
      };
      const { getByText } = render(
        <AppointmentSummaryCallout
          stepName={StepName.APPOINTMENT_FOUND}
          entry={videoData}
        />,
      );
      expect(
        getByText(locale === 'en' ? 'Video call' : '--WELSH Video call'),
      ).toBeInTheDocument();
    });
    it('renders blank when startDateTime is not provided', () => {
      const noStartDateData: BookingEntry = {
        ...entry,
        data: { ...entry.data, startDateTime: '' },
      };
      const { container } = render(
        <AppointmentSummaryCallout
          stepName={StepName.APPOINTMENT_FOUND}
          entry={noStartDateData}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
