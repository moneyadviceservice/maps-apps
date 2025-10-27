import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AboutPensionWise } from './AboutPensionWise';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('AboutPensionWise Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => {
        return [
          {
            title: 'mock-title',
            content: 'mock-content',
            items: ['mock-item', 'mock-item'],
            footer: 'mock-footer',
          },
        ];
      },
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<AboutPensionWise step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
