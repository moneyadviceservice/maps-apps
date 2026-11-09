import { render } from '@testing-library/react';

import {
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AppointmentType } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

// Mock the `useTranslation` hook
describe('AppointmentType Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AppointmentType flow="flow" step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    const { container } = render(
      <AppointmentType
        errors={{
          'field-1': ['Field 1 is required'],
        }}
        flow="flow"
        step={mockSteps[0]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
