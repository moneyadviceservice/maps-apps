import { fireEvent, render, screen } from '@testing-library/react';

import useLanguage from '@maps-react/hooks/useLanguage';
import { SubmissionState } from '@maps-react/mhf/constants';
import {
  mockEntry,
  mockSections,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AppointmentDateTime } from '.';
import { BookingSlots } from '../../lib/api/getBookingSlots';
import { FormFieldName, StepName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/hooks/useLanguage');

export const mockErrors = {
  appointmentSlotSelection: ['appointment slot selection is required'],
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const step = StepName.APPOINTMENT_DATE_TIME;
const fixedToday = new Date(2026, 8, 21, 12, 0, 0);
const firstAvailableDate = new Date(fixedToday);
const secondAvailableDate = new Date(firstAvailableDate);
secondAvailableDate.setDate(secondAvailableDate.getDate() + 1);

const mockBookingSlots: BookingSlots = [
  {
    startDateTime: '2026-10-29T11:00:00+00:00',
    slotIds: [
      {
        slotId: '8b84d2ee-3ccc-c654-cb1c-635fe4fe2606',
      },
    ],
  },
  {
    startDateTime: '2026-10-29T12:20:00+00:00',
    slotIds: [
      {
        slotId: '46e8e4ee-5a67-09d9-37ee-47789f4f6d6b',
      },
    ],
  },
];

const entry: BookingEntry = {
  ...mockEntry,
  meta: {
    submissionState: SubmissionState.SUCCEEDED,
    responseData: {
      status: true,
      message: 200,
      bookingSlots: mockBookingSlots,
    },
  },
};

const todayEntry: BookingEntry = {
  ...entry,
  meta: {
    submissionState: SubmissionState.SUCCEEDED,
    responseData: {
      status: true,
      message: 200,
      bookingSlots: [
        {
          startDateTime: '2026-09-21T11:00:00+00:00',
          slotIds: [
            {
              slotId: '8b84d2ee-3ccc-c654-cb1c-635fe4fe2606',
            },
          ],
        },
      ],
    },
  },
};

describe('AppointmentDateTime Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedToday);
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (value: string) => value,
      tList: () => mockSections,
      z: (value: { en: string; cy: string }) => value.en,
    });

    (useLanguage as jest.Mock).mockReturnValue('en');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AppointmentDateTime entry={todayEntry} step={step} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders safely when data is undefined', () => {
    const { container } = render(<AppointmentDateTime step={step} />);

    expect(container.querySelector('input[name="appointmentDate"]')).toBeNull();
  });

  it('shows error message when errors are passed', () => {
    render(
      <AppointmentDateTime entry={entry} errors={mockErrors} step={step} />,
    );

    expect(screen.getByTestId('appointment-time-error')).toBeInTheDocument();
  });

  it('calls onDateSelect when a date is selected', () => {
    const onDateSelect = jest.fn();
    const { container } = render(
      <AppointmentDateTime
        entry={entry}
        onDateSelect={onDateSelect}
        step={step}
      />,
    );

    const dayButton = container.querySelector(
      'button.rdp-day_button:not([disabled])',
    ) as HTMLButtonElement | null;

    expect(dayButton).not.toBeNull();
    if (!dayButton) return;

    fireEvent.click(dayButton);

    expect(onDateSelect).toHaveBeenCalledTimes(1);
  });

  it('uses confirm details as nextStep when entry is in edit mode', () => {
    const entry: BookingEntry = {
      ...mockEntry,
      editMode: true,
      data: {
        ...mockEntry.data,
        appointmentDate: toDateKey(firstAvailableDate),
      },
    };

    const { container } = render(
      <AppointmentDateTime entry={entry} step={step} />,
    );

    const nextStepInput = container.querySelector(
      `input[name="${FormFieldName.NEXT_STEP}"]`,
    ) as HTMLInputElement | null;

    expect(nextStepInput?.value).toBe(StepName.CONFIRM_DETAILS);
  });

  describe('month navigation', () => {
    it('renders month labels when the previous month button is not aria-disabled', () => {
      const { container } = render(
        <AppointmentDateTime entry={entry} step={step} />,
      );

      const nextMonthButton = container.querySelector(
        'button.rdp-button_next',
      ) as HTMLButtonElement | null;

      expect(nextMonthButton).not.toBeNull();
      if (!nextMonthButton) return;

      fireEvent.click(nextMonthButton);

      const previousMonthButton = container.querySelector(
        'button.rdp-button_previous',
      ) as HTMLButtonElement | null;

      expect(previousMonthButton).not.toBeNull();
      if (!previousMonthButton) return;

      expect(previousMonthButton.getAttribute('aria-disabled')).not.toBe(
        'true',
      );
      expect(previousMonthButton.textContent?.trim()).not.toBe('');
    });

    it('hides month labels when the previous month button is aria-disabled', () => {
      const { container } = render(
        <AppointmentDateTime entry={entry} step={step} />,
      );

      const previousMonthButton = container.querySelector(
        'button.rdp-button_previous',
      ) as HTMLButtonElement | null;

      expect(previousMonthButton).not.toBeNull();
      if (!previousMonthButton) return;

      expect(previousMonthButton.getAttribute('aria-disabled')).toBe('true');
      expect(previousMonthButton.textContent?.trim()).toBe('');
    });
  });

  describe('today badge', () => {
    it('shows Today in English', () => {
      const { getByText } = render(
        <AppointmentDateTime entry={todayEntry} step={step} />,
      );

      expect(getByText('Today')).toBeInTheDocument();
    });

    it('shows Heddiw in Welsh', () => {
      (useLanguage as jest.Mock).mockReturnValue('cy');
      mockUseTranslation.mockReturnValue({
        tList: () => mockSections,
        z: (value: { en: string; cy: string }) => value.cy,
      });

      const { getByText } = render(
        <AppointmentDateTime entry={todayEntry} step={step} />,
      );

      expect(getByText('Heddiw')).toBeInTheDocument();
    });
  });
});
