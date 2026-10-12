import { render } from '@testing-library/react';

import { mockSections, mockUseTranslation } from '@maps-react/mhf/mocks';

import { HoldingPage } from './HoldingPage';
jest.mock('@maps-react/hooks/useTranslation');

// Mock the `useTranslation` hook
describe('HoldingPage Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      tList: () => mockSections,
    });
  });
  it('renders component correctly', () => {
    const { container } = render(<HoldingPage />);
    expect(container).toMatchSnapshot();
  });
});
