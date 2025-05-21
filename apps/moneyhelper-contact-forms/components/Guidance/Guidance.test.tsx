import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Guidance } from './Guidance';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('Guidance Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<Guidance />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
