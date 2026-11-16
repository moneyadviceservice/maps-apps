import { render } from '@testing-library/react';

import { ErrorComponent } from './ErrorComponent';

jest.mock('@maps-react/hooks/useTranslation');

import { mockSections, mockUseTranslation } from '@maps-react/mhf/mocks';

// Mock the `useTranslation` hook
describe('ErrorComponent Component', () => {
  const tList = jest.fn(() => mockSections);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      tList,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<ErrorComponent step="error" />);

    expect(tList).toHaveBeenCalledWith('components.error.sections');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('uses the mhpd error content when flow is mhpd', () => {
    render(<ErrorComponent step="error" flow="mhpd" />);

    expect(tList).toHaveBeenCalledWith('components.error.mhpd.sections');
  });
});
