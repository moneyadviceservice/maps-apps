import { render } from '@testing-library/react';

import {
  mockErrors,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { EligibilityUKPensions } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils');

// Mock the `useTranslation` hook
describe('EligibilityUKPensions Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<EligibilityUKPensions step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <EligibilityUKPensions errors={mockErrors} step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
