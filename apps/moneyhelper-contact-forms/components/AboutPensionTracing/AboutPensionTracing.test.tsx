import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

import { AboutPensionTracing } from './AboutPensionTracing';

jest.mock('@maps-react/hooks/useTranslation');

describe('AboutPensionTracing Component', () => {
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
    const { container } = render(<AboutPensionTracing step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
