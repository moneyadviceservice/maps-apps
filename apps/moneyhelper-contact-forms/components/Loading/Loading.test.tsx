import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

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
    const { container } = render(<Loading step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
