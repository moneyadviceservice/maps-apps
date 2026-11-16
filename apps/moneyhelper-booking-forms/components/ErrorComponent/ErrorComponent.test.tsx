import { render } from '@testing-library/react';

import { mockSteps, mockUseTranslation } from '@maps-react/mhf/mocks';

import { ErrorComponent } from './ErrorComponent';

jest.mock('@maps-react/hooks/useTranslation');

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
    const { container } = render(<ErrorComponent step={mockSteps[0]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
