import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

import { SignUpUpdate } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('SignUpUpdate Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<SignUpUpdate step="sign-up-update" />);
    expect(container).toMatchSnapshot();
  });
});
