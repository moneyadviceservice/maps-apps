import { render } from '@testing-library/react';

import {
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { FindAppointment } from './';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils');

describe('FindAppointment Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (value: { en: string; cy: string }) => value.en,
      tList: () => mockSections,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<FindAppointment step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    const errors = {
      referenceNumber: ['reference-number'],
      dateOfBirth: ['date-of-birth'],
    };

    const { container } = render(
      <FindAppointment step={mockSteps[0]} errors={errors} />,
    );

    expect(container).toMatchSnapshot();
  });
});
