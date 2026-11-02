import { render, screen } from '@testing-library/react';

import { mockEntry, mockUseTranslation } from '@maps-react/mhf/mocks';
import { Entry } from '@maps-react/mhf/types';
import { Language } from '@maps-react/utils/language/language';

import { FlowName, FormFieldName, StepName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import { AppointmentSummaryCallout } from './AppointmentSummaryCallout';

jest.mock('@maps-react/hooks/useTranslation');

let entry: Entry;

describe('AppointmentSummaryCallout Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, variables?: Record<string, string>) => {
        if (key.endsWith('.title.ds')) {
          return 'Appointment title';
        }
        if (key.endsWith('.content')) {
          return `Your reference number is ${variables?.referenceNumber}.`;
        }
        if (key.endsWith('.details.date.label')) {
          return 'Appointment date';
        }
        if (key.endsWith('.details.date.value')) {
          return variables?.appointmentDate;
        }
        if (key.endsWith('.details.time.label')) {
          return 'Appointment time';
        }
        if (key.endsWith('.details.time.value')) {
          return variables?.appointmentTime;
        }
        if (key === 'common.appointment-details.duration-label') {
          return 'Duration';
        }
        if (key === 'common.appointment-details.duration-value') {
          return '45 minutes';
        }
        if (key === 'common.appointment-details.format-label') {
          return 'Format';
        }
        if (key === 'common.appointment-details.format-value') {
          return 'Online';
        }
      },
    });

    entry = {
      ...mockEntry,
      data: {
        locale: 'en' as Language,
        flow: FlowName.DIVORCE_SEPARATION,
        referenceNumber: 'ABC123',
        appointmentSlotSelection: JSON.stringify({
          date: '2026-07-14',
          startDateTime: '2026-07-14T08:10:00Z',
          slotIds: [{ slotId: 'slot-1' }],
        }),
      },
    } as BookingEntry;
  });

  it('renders the callout for the confirmation step', () => {
    const { container } = render(
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
        entry={entry}
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

  it('shows a duration row when showDuration is true', () => {
    render(
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
        entry={entry}
        showDuration
      />,
    );
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('does not show a duration row by default', () => {
    render(
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
        entry={entry}
      />,
    );
    expect(screen.queryByText('Duration')).not.toBeInTheDocument();
  });

  it('renders an empty reference number when missing', () => {
    const entryWithoutReferenceNumber = {
      ...entry,
      data: { ...entry.data, referenceNumber: undefined },
    } as unknown as Entry;

    render(
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
        entry={entryWithoutReferenceNumber}
      />,
    );
    expect(screen.getByText('Your reference number is .')).toBeInTheDocument();
  });

  it('renders an empty appointment time when missing', () => {
    const entry = {
      ...mockEntry,
      data: {
        locale: 'en' as Language,
        flow: FlowName.DIVORCE_SEPARATION,
        appointmentSlotSelection: '',
      },
    } as BookingEntry;
    const { container } = render(
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
        entry={entry}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('uses the access request specific appointment detail keys', () => {
    const entryWithAccessRequest = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
      },
    };

    const { container } = render(
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
        entry={entryWithAccessRequest}
        showDuration
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
