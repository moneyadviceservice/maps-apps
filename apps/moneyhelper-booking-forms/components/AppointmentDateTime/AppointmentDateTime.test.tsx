import { fireEvent, render, screen } from '@testing-library/react';

import useLanguage from '@maps-react/hooks/useLanguage';
import {
  mockEntry,
  mockSections,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AppointmentDateTime } from '.';
import { StepName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import { AppointmentAvailabilityResponse } from './types';

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

const firstAvailableDate = new Date();
const secondAvailableDate = new Date(firstAvailableDate);
secondAvailableDate.setDate(secondAvailableDate.getDate() + 1);

const mockAvailabilityData: AppointmentAvailabilityResponse = {
  days: [
    {
      date: toDateKey(firstAvailableDate),
      slots: [
        { id: 'slot-1::08:10', time: '08:10' },
        { id: 'slot-2::09:30', time: '09:30' },
      ],
    },
    {
      date: toDateKey(secondAvailableDate),
      slots: [{ id: 'slot-3::10:45', time: '10:45' }],
    },
  ],
};

const appointmentDateTimeStep = StepName.APPOINTMENT_DATE_TIME;

describe('AppointmentDateTime Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: (value: string) => value,
      tList: () => mockSections,
      z: (value: { en: string; cy: string }) => value.en,
    });

    (useLanguage as jest.Mock).mockReturnValue('en');
  });

  it('renders component correctly', () => {
    render(
      <AppointmentDateTime
        data={mockAvailabilityData}
        step={appointmentDateTimeStep}
      />,
    );
    expect(screen.getByTestId('appointment-date-time')).toBeInTheDocument();
  });

  it('renders safely when data is undefined', () => {
    const { container } = render(
      <AppointmentDateTime step={appointmentDateTimeStep} />,
    );

    expect(screen.getByTestId('appointment-date-time')).toBeInTheDocument();
    expect(container.querySelector('input[name="appointmentDate"]')).toBeNull();
  });

  it('shows error message when errors are passed', () => {
    render(
      <AppointmentDateTime
        data={mockAvailabilityData}
        errors={mockErrors}
        step={appointmentDateTimeStep}
      />,
    );

    expect(screen.getByTestId('appointment-time-error')).toBeInTheDocument();
  });

  it('calls onDateSelect when a date is selected', () => {
    const onDateSelect = jest.fn();
    const { container } = render(
      <AppointmentDateTime
        data={mockAvailabilityData}
        onDateSelect={onDateSelect}
        step={appointmentDateTimeStep}
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

  it('preselects date from entry data and uses contact details as default nextStep', () => {
    const entry: BookingEntry = {
      ...mockEntry,
      data: {
        ...mockEntry.data,
        appointmentDate: toDateKey(firstAvailableDate),
        appointmentSlotSelection: 'slot-1::08:10',
      },
    };

    const { container } = render(
      <AppointmentDateTime
        data={mockAvailabilityData}
        entry={entry}
        step={appointmentDateTimeStep}
      />,
    );

    const appointmentDateInput = container.querySelector(
      'input[name="appointmentDate"]',
    ) as HTMLInputElement | null;
    const nextStepInput = container.querySelector(
      'input[name="nextStep"]',
    ) as HTMLInputElement | null;
    const selectedSlotInput = container.querySelector(
      'input[name="appointmentSlotSelection"][value="slot-1::08:10"]',
    ) as HTMLInputElement | null;

    expect(appointmentDateInput?.value).toBe(toDateKey(firstAvailableDate));
    expect(nextStepInput?.value).toBe(StepName.CONTACT_DETAILS);
    expect(selectedSlotInput).not.toBeNull();
    expect(selectedSlotInput).toBeChecked();
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
      <AppointmentDateTime
        data={mockAvailabilityData}
        entry={entry}
        step={appointmentDateTimeStep}
      />,
    );

    const nextStepInput = container.querySelector(
      'input[name="nextStep"]',
    ) as HTMLInputElement | null;

    expect(nextStepInput?.value).toBe(StepName.CONFIRM_DETAILS);
  });

  describe('month navigation', () => {
    it('renders month labels when the previous month button is not aria-disabled', () => {
      const { container } = render(
        <AppointmentDateTime
          data={mockAvailabilityData}
          step={appointmentDateTimeStep}
        />,
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
        <AppointmentDateTime
          data={mockAvailabilityData}
          step={appointmentDateTimeStep}
        />,
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
        <AppointmentDateTime
          data={mockAvailabilityData}
          step={appointmentDateTimeStep}
        />,
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
        <AppointmentDateTime
          data={mockAvailabilityData}
          step={appointmentDateTimeStep}
        />,
      );

      expect(getByText('Heddiw')).toBeInTheDocument();
    });
  });
});
