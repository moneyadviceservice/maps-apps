import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AppointmentType } from '.';
import { mockRadioOptions } from '../../lib/mocks';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;
const mockStep = 'mock-step';

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
      <AppointmentType flow="flow" step={mockStep} />,
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
        step={mockStep}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
