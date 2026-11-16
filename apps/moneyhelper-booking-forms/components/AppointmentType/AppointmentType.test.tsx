import { fireEvent, render, screen } from '@testing-library/react';

import {
  mockErrors,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AppointmentType } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

// Mock the `useTranslation` hook
describe('AppointmentType Component', () => {
  const appointmentOptions = [
    { text: 'Pension Wise', value: 'pw' },
    { text: 'Divorce and separation', value: 'ds|divorce-appointment' },
  ];

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => appointmentOptions,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<AppointmentType step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <AppointmentType errors={mockErrors} step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('prevents the normal form submission for Pension Wise', () => {
    render(<AppointmentType step={mockSteps[0]} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Pension Wise' }));

    expect(fireEvent.submit(screen.getByRole('form'))).toBe(false);
  });

  it('submits the form normally for non-Pension Wise options', () => {
    render(<AppointmentType step={mockSteps[0]} />);
    fireEvent.click(
      screen.getByRole('radio', { name: 'Divorce and separation' }),
    );
    expect(fireEvent.submit(screen.getByRole('form'))).toBe(true);
  });
});
