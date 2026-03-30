import { render } from '@testing-library/react';

import { mockSections, mockUseTranslation } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { HelpSidebar } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils');

// Mock the `useTranslation` hook
describe('HelpSidebar Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockSections,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<HelpSidebar />);
    expect(container).toMatchSnapshot();
  });
});
