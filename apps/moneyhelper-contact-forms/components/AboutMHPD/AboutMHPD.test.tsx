import { render } from '@testing-library/react';

import { AboutMHPD } from './AboutMHPD';

jest.mock('@maps-react/hooks/useTranslation');

import { mockUseTranslation } from '@maps-react/mhf/mocks';

describe('AboutMHPD Component', () => {
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
    const { container } = render(<AboutMHPD step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
