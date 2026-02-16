import { render } from '@testing-library/react';

import { ErrorComponent } from './ErrorComponent';

jest.mock('@maps-react/hooks/useTranslation');

import { mockUseTranslation } from '@maps-react/mhf/mocks';

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
