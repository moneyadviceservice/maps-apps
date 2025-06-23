import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AboutStatePension } from './AboutStatePension';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('AboutStatePension Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => ['mock-value', 'mock-text'],
      local: 'en',
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<AboutStatePension />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders list items correctly', () => {
    const { getByTestId } = render(<AboutStatePension />);
    const listItems = getByTestId('about-state-pension-list').children;
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toBe('mock-value');
    expect(listItems[1].textContent).toBe('mock-text');
  });
});
