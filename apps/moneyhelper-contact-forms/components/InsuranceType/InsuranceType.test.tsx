import { render } from '@testing-library/react';

import {
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { InsuranceType } from './';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

// Mock the `useTranslation` hook
describe('InsuranceType Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(
      <InsuranceType flow="flow" step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    const { container } = render(
      <InsuranceType
        errors={{ 'mock-field': ['mock-error'] }}
        flow="flow"
        step={mockSteps[0]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
