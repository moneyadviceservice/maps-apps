import React from 'react';

import { render } from '@testing-library/react';

import SignIn, { Props } from './SignIn';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: jest.fn(),
  }),
}));

describe('SignIn Component', () => {
  const defaultProps: Props = {
    lang: 'en',
    user: { username: '', password: '' },
    errors: [],
  };

  it('renders the SignIn component', () => {
    render(<SignIn {...defaultProps} />);
  });
});
