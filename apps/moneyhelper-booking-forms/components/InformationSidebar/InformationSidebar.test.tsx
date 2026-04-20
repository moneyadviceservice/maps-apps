import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { InformationSidebar } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils');

// Mock the `useTranslation` hook
describe('InformationSidebar Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<InformationSidebar flow="test-flow" />);
    expect(container).toMatchSnapshot();
  });

  it('renders null when flow is not provided', () => {
    const { container } = render(<InformationSidebar flow="" />);
    expect(container.firstChild).toBeNull();
  });
});
