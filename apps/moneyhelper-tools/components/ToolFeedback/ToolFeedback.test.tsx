import { render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ToolFeedback } from './ToolFeedback';

jest.mock('@maps-react/hooks/useTranslation');

describe('ToolFeedback component', () => {
  it('renders correctly (en)', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const { container } = render(<ToolFeedback id="test-id" />);
    expect(container.firstChild).toMatchSnapshot();

    jest.clearAllMocks();
  });

  it('renders correctly (cy)', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'cy',
    });

    const { container } = render(<ToolFeedback id="test-id" />);
    expect(container.firstChild).toMatchSnapshot();

    jest.clearAllMocks();
  });
});
