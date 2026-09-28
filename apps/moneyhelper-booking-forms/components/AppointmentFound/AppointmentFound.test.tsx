import { render } from '@testing-library/react';

import {
  mockEntry,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AppointmentFound } from '.';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

describe('AppointmentFound Component', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(false);
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AppointmentFound step={mockSteps[0]} entry={mockEntry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('throws when entry is missing', () => {
    expect(() =>
      render(<AppointmentFound entry={undefined} step={mockSteps[0]} />),
    ).toThrow('[AppointmentFound] Missing entry');
  });

  it('renders error state correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AppointmentFound step={mockSteps[0]} entry={mockEntry} />,
    );
    expect(container).toMatchSnapshot();
  });
});
