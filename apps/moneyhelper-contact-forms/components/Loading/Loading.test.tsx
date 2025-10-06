import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Loading } from './Loading';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

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
