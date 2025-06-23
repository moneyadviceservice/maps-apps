import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AboutPensionTracing } from './AboutPensionTracing';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('AboutPensionTracing Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      local: 'en',
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<AboutPensionTracing />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
