import { render } from '@testing-library/react';

import { mockSteps, mockUseTranslation } from '@maps-react/mhf/mocks';

import { Loading } from './Loading';

jest.mock('@maps-react/hooks/useTranslation');

// Mock the `useTranslation` hook
describe('Loading Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });
  it('renders component correctly', () => {
    const { container } = render(<Loading step={mockSteps[0]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
