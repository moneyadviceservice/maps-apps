import { render } from '@testing-library/react';

import { mockSections, mockUseTranslation } from '@maps-react/mhf/mocks';

import { NoJsNotice } from '.';

jest.mock('@maps-react/hooks/useTranslation');

describe('NoJsNotice Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      tList: () => mockSections,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<NoJsNotice />);
    expect(container).toMatchSnapshot();
  });
});
