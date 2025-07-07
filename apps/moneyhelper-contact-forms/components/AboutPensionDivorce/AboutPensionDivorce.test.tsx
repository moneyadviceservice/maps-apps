import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AboutPensionDivorce } from './AboutPensionDivorce';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('AboutPensionDivorce Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => ['mock-value', 'mock-text'],
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<AboutPensionDivorce />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders list items correctly', () => {
    const { getByTestId } = render(<AboutPensionDivorce />);
    const listItems = getByTestId('about-pension-divorce-list').children;
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toBe('mock-value');
    expect(listItems[1].textContent).toBe('mock-text');
  });
});
