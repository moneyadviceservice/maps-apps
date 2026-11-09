import { render } from '@testing-library/react';

import {
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { HealthConditionsImpact } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

describe('HealthConditionsImpact Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
      locale: 'en',
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <HealthConditionsImpact step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <HealthConditionsImpact errors={mockErrors} step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
