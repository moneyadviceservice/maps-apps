import { render } from '@testing-library/react';

import type { OpeningTimes } from '../../utils/FuelFinder/types';
import OpeningHours from './OpeningHours';

const fullWeek: OpeningTimes = {
  usual_days: {
    monday: { open: '06:00', close: '22:00', is_24_hours: false },
    tuesday: { open: '06:00', close: '22:00', is_24_hours: false },
    wednesday: { open: '06:00', close: '22:00', is_24_hours: false },
    thursday: { open: '06:00', close: '22:00', is_24_hours: false },
    friday: { open: '06:00', close: '22:00', is_24_hours: false },
    saturday: { open: '07:00', close: '21:00', is_24_hours: false },
    sunday: { open: '08:00', close: '20:00', is_24_hours: false },
  },
};

describe('OpeningHours', () => {
  beforeAll(() => {
    // Wednesday 2025-06-04 — keeps the "today" highlight deterministic.
    jest
      .useFakeTimers({ doNotFake: ['setTimeout'] })
      .setSystemTime(new Date('2025-06-04T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders the empty state when usual_days is missing', () => {
    const { container } = render(<OpeningHours hours={{} as OpeningTimes} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a full Mon–Sun week with Wednesday highlighted as today', () => {
    const { container } = render(<OpeningHours hours={fullWeek} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders 24-hour days using the "24 hours" label', () => {
    const hours: OpeningTimes = {
      usual_days: {
        monday: { open: '00:00', close: '00:00', is_24_hours: true },
        tuesday: { open: '00:00', close: '00:00', is_24_hours: true },
        wednesday: { open: '00:00', close: '00:00', is_24_hours: true },
        thursday: { open: '00:00', close: '00:00', is_24_hours: true },
        friday: { open: '00:00', close: '00:00', is_24_hours: true },
        saturday: { open: '00:00', close: '00:00', is_24_hours: true },
        sunday: { open: '00:00', close: '00:00', is_24_hours: true },
      },
    };
    const { container } = render(<OpeningHours hours={hours} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders an extra row for bank_holiday hours when provided', () => {
    const hours: OpeningTimes = {
      ...fullWeek,
      bank_holiday: {
        type: 'easter',
        open_time: '09:00',
        close_time: '17:00',
        is_24_hours: false,
      },
    };
    const { container } = render(<OpeningHours hours={hours} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders bank_holiday as "24 hours" when is_24_hours is true', () => {
    const hours: OpeningTimes = {
      ...fullWeek,
      bank_holiday: {
        type: 'christmas',
        open_time: '00:00',
        close_time: '00:00',
        is_24_hours: true,
      },
    };
    const { container } = render(<OpeningHours hours={hours} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('skips days that are not present in usual_days', () => {
    const hours: OpeningTimes = {
      usual_days: {
        monday: { open: '08:00', close: '18:00', is_24_hours: false },
        friday: { open: '09:00', close: '17:00', is_24_hours: false },
      },
    };
    const { container } = render(<OpeningHours hours={hours} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
