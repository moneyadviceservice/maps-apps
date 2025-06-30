import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { AboutMoneyManagement } from './AboutMoneyManagement';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('AboutMoneyManagement Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      local: 'en',
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<AboutMoneyManagement />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
