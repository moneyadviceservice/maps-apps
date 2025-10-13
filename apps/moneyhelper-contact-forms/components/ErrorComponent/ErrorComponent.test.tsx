import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ErrorComponent } from './ErrorComponent';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('ErrorComponent Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
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
    const { container } = render(<ErrorComponent step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
