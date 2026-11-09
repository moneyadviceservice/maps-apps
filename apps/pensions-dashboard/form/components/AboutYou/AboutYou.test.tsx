import { render } from '@testing-library/react';

import {
  mockErrors,
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AboutYou } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/mhf/utils/getFieldError');
jest.mock('@maps-react/hooks/useTranslation');

describe('AboutYou Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockSections,
      locale: 'en',
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });
  it('renders component correctly', () => {
    const { container } = render(<AboutYou step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <AboutYou errors={mockErrors} step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
